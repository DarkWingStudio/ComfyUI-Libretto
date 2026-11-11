/**
 * ComfyUI Graph interaction utilities.
 */

declare const LiteGraph: any;

let undoSnapshot: any = null;

export function saveGraphUndoSnapshot(): void {
  try {
    undoSnapshot = getActiveGraphData();
  } catch {
    undoSnapshot = null;
  }
}

export function restoreGraphUndoSnapshot(): boolean {
  if (!undoSnapshot) return false;
  const app = getComfyApp();
  if (!app || !app.graph) return false;
  app.loadGraphData(undoSnapshot);
  undoSnapshot = null;
  return true;
}

export function hasUndoSnapshot(): boolean {
  return undoSnapshot !== null;
}

export function getComfyApp(): any {
  if (typeof window !== "undefined") {
    if ((window as any).comfyAPI?.app?.app) {
      return (window as any).comfyAPI.app.app;
    }
    if ((window as any).app) {
      return (window as any).app;
    }
  }
  return null;
}

export function getSelectedNodesData(): any {
  const app = getComfyApp();
  if (!app || !app.graph || !app.canvas) {
    return null;
  }

  const selectedNodesObj = app.canvas.selected_nodes;
  if (!selectedNodesObj || Object.keys(selectedNodesObj).length === 0) {
    return null;
  }

  const selectedList = Object.values(selectedNodesObj) as any[];
  const selectedIds = new Set(selectedList.map((n) => n.id));

  // Serialize each selected node
  const serializedNodes = selectedList.map((n) => (n.serialize ? n.serialize() : { id: n.id, type: n.type, pos: n.pos }));

  // Collect links connecting the selected nodes
  const allLinks = app.graph.links;
  const filteredLinks: any[] = [];
  if (allLinks) {
    const linkValues = Array.isArray(allLinks) ? allLinks : Object.values(allLinks);
    for (const link of linkValues as any[]) {
      if (!link) continue;
      const originId = link.origin_id !== undefined ? link.origin_id : link[1];
      const targetId = link.target_id !== undefined ? link.target_id : link[3];
      if (selectedIds.has(originId) && selectedIds.has(targetId)) {
        filteredLinks.push(Array.isArray(link) ? link : [
          link.id,
          link.origin_id,
          link.origin_slot,
          link.target_id,
          link.target_slot,
          link.type,
        ]);
      }
    }
  }

  return {
    nodes: serializedNodes,
    links: filteredLinks,
  };
}

export function captureCanvasScreenshot(): string | null {
  const app = getComfyApp();
  if (!app || !app.canvas?.canvas) return null;
  try {
    const canvas = app.canvas.canvas as HTMLCanvasElement;
    return canvas.toDataURL("image/webp", 0.7);
  } catch {
    return null;
  }
}

export function getActiveGraphData(): any {
  const app = getComfyApp();
  if (!app || !app.graph) {
    throw new Error("ComfyUI graph is not available.");
  }
  return app.graph.serialize();
}

export function checkNodeCompatibility(nodeClasses: string[]): {
  missing: string[];
  installed: string[];
} {
  const missing: string[] = [];
  const installed: string[] = [];

  const registered = typeof LiteGraph !== "undefined" ? LiteGraph.registered_node_types : null;

  for (const nc of nodeClasses) {
    if (registered && (registered[nc] || registered[nc.replace(/ /g, "")])) {
      installed.push(nc);
    } else {
      missing.push(nc);
    }
  }

  return { missing, installed };
}

export function applyWorkflowToGraph(
  rawWorkflowData: any,
  mode: "smart_apply" | "insert_copy" | "replace" = "smart_apply",
  parameterOverrides?: Record<string, any>
): { adjustedCount: number; addedCount: number } {
  const app = getComfyApp();
  if (!app || !app.graph) {
    throw new Error("ComfyUI graph is not available.");
  }

  saveGraphUndoSnapshot();
  const workflowData = JSON.parse(JSON.stringify(rawWorkflowData));

  if (parameterOverrides && Array.isArray(workflowData.nodes)) {
    for (const node of workflowData.nodes) {
      if (node.type === "LibrettoInput" && Array.isArray(node.widgets_values)) {
        const paramName = node.widgets_values[0];
        if (paramName && parameterOverrides[paramName] !== undefined) {
          const overrideVal = parameterOverrides[paramName];
          const vtype = String(node.widgets_values[1] || "STRING").toUpperCase();

          if (vtype === "INT") {
            node.widgets_values[3] = parseInt(String(overrideVal), 10) || 0;
          } else if (vtype === "FLOAT") {
            node.widgets_values[4] = parseFloat(String(overrideVal)) || 0.0;
          } else if (vtype === "BOOLEAN") {
            node.widgets_values[5] = Boolean(overrideVal);
          } else {
            node.widgets_values[2] = String(overrideVal);
          }
        }
      }
    }
  }

  if (mode === "replace") {
    app.loadGraphData(workflowData);
    return { adjustedCount: 0, addedCount: workflowData.nodes?.length || 0 };
  }

  const currentGraph = app.graph;
  if (!workflowData || !Array.isArray(workflowData.nodes)) {
    app.loadGraphData(workflowData);
    return { adjustedCount: 0, addedCount: 0 };
  }

  const existingNodes = currentGraph._nodes || [];
  let maxId = 0;
  for (const n of existingNodes) {
    if (n.id > maxId) maxId = n.id;
  }
  for (const n of workflowData.nodes) {
    if (n.id > maxId) maxId = n.id;
  }

  let minX = Infinity, minY = Infinity;
  for (const n of workflowData.nodes) {
    if (n.pos) {
      if (n.pos[0] < minX) minX = n.pos[0];
      if (n.pos[1] < minY) minY = n.pos[1];
    }
  }

  let targetX = 100, targetY = 100;
  if (app.canvas?.visible_area && app.canvas.visible_area.length >= 4) {
    targetX = app.canvas.visible_area[0] + 50;
    targetY = app.canvas.visible_area[1] + 50;
  } else if (app.canvas?.ds?.offset && app.canvas?.ds?.scale) {
    const scale = app.canvas.ds.scale || 1.0;
    targetX = -app.canvas.ds.offset[0] / scale + 50;
    targetY = -app.canvas.ds.offset[1] / scale + 50;
  }

  const offsetX = targetX - (minX === Infinity ? 0 : minX);
  const offsetY = targetY - (minY === Infinity ? 0 : minY);

  const idShift = maxId + 10;
  const idMap = new Map<number, number>();

  for (const n of workflowData.nodes) {
    const oldId = n.id;
    const newId = oldId + idShift;
    idMap.set(oldId, newId);
    n.id = newId;
    if (n.pos) {
      n.pos[0] += offsetX;
      n.pos[1] += offsetY;
    }
  }

  if (Array.isArray(workflowData.links)) {
    for (const link of workflowData.links) {
      if (Array.isArray(link) && link.length >= 5) {
        if (idMap.has(link[1])) link[1] = idMap.get(link[1]);
        if (idMap.has(link[3])) link[3] = idMap.get(link[3]);
        link[0] += idShift * 10;
      }
    }
  }

  insertSubflowIntoCanvas(workflowData, [0, 0]);
  return { adjustedCount: 0, addedCount: workflowData.nodes.length };
}

export function extractGraphRequirements(): {
  node_classes: string[];
  models: string[];
} {
  const app = getComfyApp();
  if (!app || !app.graph) {
    return { node_classes: [], models: [] };
  }

  const nodeClasses = new Set<string>();
  const models = new Set<string>();

  const nodes = app.graph._nodes || [];
  for (const node of nodes) {
    if (node.type) {
      nodeClasses.add(node.type);
    }
    if (node.widgets) {
      for (const widget of node.widgets) {
        if (
          widget.name &&
          (widget.name.toLowerCase().includes("ckpt") ||
            widget.name.toLowerCase().includes("model") ||
            widget.name.toLowerCase().includes("unet") ||
            widget.name.toLowerCase().includes("lora"))
        ) {
          if (typeof widget.value === "string" && widget.value.trim()) {
            models.add(widget.value.trim());
          }
        }
      }
    }
  }

  return {
    node_classes: Array.from(nodeClasses),
    models: Array.from(models),
  };
}

export function getGraphInterfaces(): {
  inputs: Array<{ name: string; value_type: string; description: string; default_value: any; node_id: string }>;
  outputs: Array<{ name: string; value_type: string; description: string; default_value: any; node_id: string }>;
} {
  const app = getComfyApp();
  if (!app || !app.graph) {
    return { inputs: [], outputs: [] };
  }

  const inputs: any[] = [];
  const outputs: any[] = [];

  const nodes = app.graph._nodes || [];
  for (const node of nodes) {
    if (node.type === "LibrettoInput") {
      const nameWidget = node.widgets?.find((w: any) => w.name === "interface_name");
      const typeWidget = node.widgets?.find((w: any) => w.name === "value_type");
      const descWidget = node.widgets?.find((w: any) => w.name === "description");
      const defaultWidget = node.widgets?.find((w: any) => w.name === "default_value");

      inputs.push({
        name: nameWidget?.value || `Input_${node.id}`,
        value_type: typeWidget?.value || "STRING",
        description: descWidget?.value || "",
        default_value: defaultWidget?.value ?? null,
        node_id: String(node.id),
      });
    } else if (node.type === "LibrettoOutput") {
      const nameWidget = node.widgets?.find((w: any) => w.name === "interface_name");
      const typeWidget = node.widgets?.find((w: any) => w.name === "value_type");
      const descWidget = node.widgets?.find((w: any) => w.name === "description");

      outputs.push({
        name: nameWidget?.value || `Output_${node.id}`,
        value_type: typeWidget?.value || "IMAGE",
        description: descWidget?.value || "",
        default_value: null,
        node_id: String(node.id),
      });
    }
  }

  return { inputs, outputs };
}

export function loadWorkflowIntoCanvas(workflowData: any): void {
  const app = getComfyApp();
  if (!app || !app.graph) {
    throw new Error("ComfyUI canvas not ready.");
  }
  saveGraphUndoSnapshot();
  app.loadGraphData(workflowData);
}

export function insertSubflowIntoCanvas(workflowData: any, offset = [100, 100]): void {
  const app = getComfyApp();
  if (!app || !app.graph) {
    throw new Error("ComfyUI canvas not ready.");
  }

  saveGraphUndoSnapshot();
  const graph = app.graph;
  const nodes = workflowData.nodes || [];
  const links = workflowData.links || [];

  const idMap = new Map<number, number>();
  const newNodes: any[] = [];

  const lg = getLiteGraph();
  if (!lg) throw new Error("LiteGraph not found");

  for (const nData of nodes) {
    const node = lg.createNode(nData.type);
    if (!node) continue;

    if (nData.pos) {
      node.pos = [nData.pos[0] + offset[0], nData.pos[1] + offset[1]];
    }
    if (nData.size) {
      node.size = [...nData.size];
    }
    if (nData.widgets_values && node.widgets) {
      nData.widgets_values.forEach((val: any, idx: number) => {
        if (node.widgets[idx]) {
          node.widgets[idx].value = val;
        }
      });
    }

    graph.add(node);
    idMap.set(nData.id, node.id);
    newNodes.push(node);
  }

  for (const link of links) {
    const originNodeId = idMap.get(link[1]);
    const targetNodeId = idMap.get(link[3]);
    const originSlot = link[2];
    const targetSlot = link[4];

    if (originNodeId !== undefined && targetNodeId !== undefined) {
      const originNode = graph.getNodeById(originNodeId);
      const targetNode = graph.getNodeById(targetNodeId);
      if (originNode && targetNode) {
        originNode.connect(originSlot, targetNode, targetSlot);
      }
    }
  }

  if (app.canvas && newNodes.length > 0) {
    app.canvas.selectNodes(newNodes);
  }
  graph.setDirtyCanvas(true, true);
}

function getLiteGraph(): any {
  if (typeof LiteGraph !== "undefined") {
    return LiteGraph;
  }
  const app = getComfyApp();
  if (app?.graph?.constructor) {
    return (window as any).LiteGraph || null;
  }
  return null;
}

/**
 * Smartly updates existing CLIPTextEncode or LibrettoPromptBuilder nodes on the canvas,
 * or adds new nodes if none exist.
 */
export function addPromptBuilderToGraph(
  profileId: string,
  components: Array<{
    name: string;
    category: string;
    keywords: string;
    description: string;
    negative: string;
    weight: number;
  }>,
  compiledPositive: string,
  compiledNegative: string
): { success: boolean; mode: "libretto_nodes" | "text_encode_nodes" | "updated_existing" | "error"; message: string } {
  const app = getComfyApp();
  if (!app || !app.graph) {
    return { success: false, mode: "error", message: "ComfyUI canvas not found. Make sure ComfyUI is loaded." };
  }

  const lg = getLiteGraph();
  if (!lg) {
    return { success: false, mode: "error", message: "LiteGraph engine not accessible on page." };
  }

  saveGraphUndoSnapshot();
  const graph = app.graph;
  const canvas = app.canvas;

  // 1. Check if user currently has node(s) selected
  const selectedNodes: any[] = canvas?.selected_nodes ? Object.values(canvas.selected_nodes) : [];
  if (selectedNodes.length > 0) {
    const textNodes = selectedNodes.filter(
      (n: any) => n.type === "CLIPTextEncode" || (n.widgets && n.widgets.some((w: any) => w.name === "text"))
    );
    if (textNodes.length === 1) {
      const textWidget = textNodes[0].widgets?.find((w: any) => w.name === "text") || textNodes[0].widgets?.[0];
      if (textWidget) {
        textWidget.value = compiledPositive;
        graph.setDirtyCanvas(true, true);
        return {
          success: true,
          mode: "updated_existing",
          message: `✓ Updated selected node #${textNodes[0].id} with positive prompt!`,
        };
      }
    } else if (textNodes.length >= 2) {
      // First selected = positive, second selected = negative
      const w0 = textNodes[0].widgets?.find((w: any) => w.name === "text") || textNodes[0].widgets?.[0];
      const w1 = textNodes[1].widgets?.find((w: any) => w.name === "text") || textNodes[1].widgets?.[0];
      if (w0) w0.value = compiledPositive;
      if (w1) w1.value = compiledNegative;
      graph.setDirtyCanvas(true, true);
      return {
        success: true,
        mode: "updated_existing",
        message: "✓ Updated selected positive & negative prompt nodes!",
      };
    }
  }

  // 2. Search canvas for existing CLIPTextEncode or LibrettoPromptBuilder nodes
  const allNodes: any[] = graph._nodes || [];
  const clipNodes = allNodes.filter(
    (n: any) => n.type === "CLIPTextEncode" && n.widgets && n.widgets.length > 0
  );

  if (clipNodes.length >= 1) {
    let posNode: any = null;
    let negNode: any = null;

    // Check titles or connection to KSampler
    for (const node of clipNodes) {
      const title = (node.title || "").toLowerCase();
      if (title.includes("pos") || title.includes("libretto positive")) {
        posNode = node;
      } else if (title.includes("neg") || title.includes("libretto negative")) {
        negNode = node;
      }
    }

    // If not identified by title, inspect output links to KSampler / samplers
    if (!posNode || !negNode) {
      for (const node of clipNodes) {
        if (!node.outputs || !node.outputs[0] || !node.outputs[0].links) continue;
        for (const linkId of node.outputs[0].links) {
          const link = graph.links ? (Array.isArray(graph.links) ? graph.links[linkId] : graph.links[linkId]) : null;
          if (!link) continue;
          const targetNodeId = link.target_id !== undefined ? link.target_id : link[3];
          const targetSlot = link.target_slot !== undefined ? link.target_slot : link[4];
          const targetNode = graph.getNodeById(targetNodeId);
          if (targetNode) {
            const inputName = targetNode.inputs?.[targetSlot]?.name?.toLowerCase() || "";
            if (inputName.includes("positive") || targetSlot === 1) {
              posNode = node;
            } else if (inputName.includes("negative") || targetSlot === 2) {
              negNode = node;
            }
          }
        }
      }
    }

    // Fallback: if two CLIPTextEncode nodes exist, top one is positive, bottom is negative
    if (!posNode && !negNode && clipNodes.length >= 2) {
      const sorted = [...clipNodes].sort((a, b) => a.pos[1] - b.pos[1]);
      posNode = sorted[0];
      negNode = sorted[1];
    } else if (!posNode && clipNodes.length === 1) {
      posNode = clipNodes[0];
    }

    let updatedCount = 0;
    if (posNode) {
      const w = posNode.widgets?.find((item: any) => item.name === "text") || posNode.widgets[0];
      if (w) {
        w.value = compiledPositive;
        updatedCount++;
      }
    }
    if (negNode && compiledNegative) {
      const w = negNode.widgets?.find((item: any) => item.name === "text") || negNode.widgets[0];
      if (w) {
        w.value = compiledNegative;
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      if (canvas?.selectNodes) {
        canvas.selectNodes([posNode, negNode].filter(Boolean));
      }
      graph.setDirtyCanvas(true, true);
      return {
        success: true,
        mode: "updated_existing",
        message: `✓ Updated ${updatedCount} existing prompt node(s) on canvas!`,
      };
    }
  }

  // 3. Compute center position in current viewport to place new nodes
  let centerX = 300;
  let centerY = 200;
  if (canvas?.visible_area && canvas.visible_area.length >= 4) {
    centerX = canvas.visible_area[0] + canvas.visible_area[2] / 2;
    centerY = canvas.visible_area[1] + canvas.visible_area[3] / 2;
  } else if (canvas?.ds?.offset && canvas?.ds?.scale) {
    const scale = canvas.ds.scale || 1.0;
    const w = canvas.canvas?.width || 800;
    const h = canvas.canvas?.height || 600;
    centerX = -canvas.ds.offset[0] / scale + (w / 2) / scale;
    centerY = -canvas.ds.offset[1] / scale + (h / 2) / scale;
  }

  const isLibrettoRegistered = Boolean(lg.registered_node_types && lg.registered_node_types["LibrettoPromptBuilder"]);

  if (isLibrettoRegistered) {
    // 1. Create Profile Node
    let profileNodeType = "LibrettoSDXLProfile";
    if (profileId === "pony") profileNodeType = "LibrettoPonyProfile";
    else if (profileId === "flux") profileNodeType = "LibrettoFluxProfile";
    else if (profileId === "sd15") profileNodeType = "LibrettoSD15Profile";
    else if (profileId === "animagine") profileNodeType = "LibrettoAnimagineProfile";
    else if (profileId === "illustrious") profileNodeType = "LibrettoIllustriousProfile";
    else if (profileId === "photoreal") profileNodeType = "LibrettoPhotorealProfile";
    else if (profileId === "custom") profileNodeType = "LibrettoCustomProfile";

    const profileNode = lg.createNode(profileNodeType);
    if (profileNode) {
      profileNode.pos = [centerX - 340, centerY - 80];
      graph.add(profileNode);
    }

    // 2. Create Prompt Builder Node
    const builderNode = lg.createNode("LibrettoPromptBuilder");
    if (!builderNode) {
      return { success: false, mode: "error", message: "Failed to instantiate LibrettoPromptBuilder node." };
    }
    builderNode.pos = [centerX + 20, centerY];
    graph.add(builderNode);

    if (profileNode) {
      profileNode.connect(0, builderNode, 0);
    }

    // 3. Create Asset Nodes for active components
    components.slice(0, 6).forEach((comp, idx) => {
      let assetNodeType = "LibrettoCustomPrompt";
      const cat = (comp.category || "").toLowerCase();
      if (cat === "character") assetNodeType = "LibrettoCharacter";
      else if (cat === "costume") assetNodeType = "LibrettoOutfit";
      else if (cat === "hair") assetNodeType = "LibrettoHair";
      else if (cat === "pose") assetNodeType = "LibrettoPose";
      else if (cat === "emotion" || cat === "expression") assetNodeType = "LibrettoExpression";
      else if (cat === "environment" || cat === "location") assetNodeType = "LibrettoEnvironment";
      else if (cat === "lighting") assetNodeType = "LibrettoLighting";
      else if (cat === "camera" || cat === "view") assetNodeType = "LibrettoCamera";
      else if (cat === "style") assetNodeType = "LibrettoStyle";

      const aNode = lg.createNode(assetNodeType);
      if (aNode) {
        aNode.pos = [centerX - 340, centerY + 80 + idx * 110];
        if (aNode.widgets) {
          for (const w of aNode.widgets) {
            if (w.name === "name") w.value = comp.name || "";
            else if (w.name === "keywords") w.value = comp.keywords || "";
            else if (w.name === "description") w.value = comp.description || "";
            else if (w.name === "weight") w.value = comp.weight || 1.0;
          }
        }
        graph.add(aNode);
        aNode.connect(0, builderNode, 1 + idx);
      }
    });

    if (canvas?.selectNode) {
      canvas.selectNode(builderNode);
    }

    graph.setDirtyCanvas(true, true);
    return {
      success: true,
      mode: "libretto_nodes",
      message: "Libretto Prompt Builder & component nodes added to canvas!",
    };
  }

  // 4. Fallback: Place Positive and Negative text nodes
  const posNode = lg.createNode("CLIPTextEncode");
  if (posNode) {
    posNode.pos = [centerX, centerY - 80];
    posNode.title = "Libretto Positive Prompt";
    if (posNode.widgets && posNode.widgets[0]) {
      posNode.widgets[0].value = compiledPositive || "masterpiece, best quality";
    }
    graph.add(posNode);
  }

  const negNode = lg.createNode("CLIPTextEncode");
  if (negNode) {
    negNode.pos = [centerX, centerY + 120];
    negNode.title = "Libretto Negative Prompt";
    if (negNode.widgets && negNode.widgets[0]) {
      negNode.widgets[0].value = compiledNegative || "";
    }
    graph.add(negNode);
  }

  if (posNode && canvas?.selectNode) {
    canvas.selectNode(posNode);
  }

  graph.setDirtyCanvas(true, true);
  return {
    success: true,
    mode: "text_encode_nodes",
    message: "Placed Positive & Negative text nodes with compiled prompts on canvas!",
  };
}
