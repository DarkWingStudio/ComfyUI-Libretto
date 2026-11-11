import { app as Es } from "../../scripts/app.js";
/**
* @vue/shared v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function Mn(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const s of e.split(",")) t[s] = 1;
  return (s) => s in t;
}
const ve = {}, Bt = [], at = () => {
}, Vo = () => !1, Js = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Ys = (e) => e.startsWith("onUpdate:"), xe = Object.assign, Rn = (e, t) => {
  const s = e.indexOf(t);
  s > -1 && e.splice(s, 1);
}, ur = Object.prototype.hasOwnProperty, fe = (e, t) => ur.call(e, t), z = Array.isArray, Et = (e) => ks(e) === "[object Map]", wt = (e) => ks(e) === "[object Set]", eo = (e) => ks(e) === "[object Date]", ne = (e) => typeof e == "function", _e = (e) => typeof e == "string", ct = (e) => typeof e == "symbol", de = (e) => e !== null && typeof e == "object", Bo = (e) => (de(e) || ne(e)) && ne(e.then) && ne(e.catch), Ho = Object.prototype.toString, ks = (e) => Ho.call(e), fr = (e) => ks(e).slice(8, -1), Ko = (e) => ks(e) === "[object Object]", Dn = (e) => _e(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, is = /* @__PURE__ */ Mn(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Xs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (s) => t[s] || (t[s] = e(s));
}, dr = /-\w/g, Ze = /* @__PURE__ */ Xs((e) => e.replace(dr, (t) => t.slice(1).toUpperCase())), pr = /\B([A-Z])/g, Gt = /* @__PURE__ */ Xs(
  (e) => e.replace(pr, "-$1").toLowerCase()
), qo = /* @__PURE__ */ Xs((e) => e.charAt(0).toUpperCase() + e.slice(1)), un = /* @__PURE__ */ Xs((e) => e ? `on${qo(e)}` : ""), rt = (e, t) => !Object.is(e, t), Rs = (e, ...t) => {
  for (let s = 0; s < e.length; s++)
    e[s](...t);
}, Go = (e, t, s, n = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: n,
    value: s
  });
}, Ss = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, hr = (e) => {
  const t = _e(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let to;
const Zs = () => to || (to = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Yt(e) {
  if (z(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++) {
      const n = e[s], o = _e(n) ? yr(n) : Yt(n);
      if (o)
        for (const i in o)
          t[i] = o[i];
    }
    return t;
  } else if (_e(e) || de(e))
    return e;
}
const gr = /;(?![^(]*\))/g, vr = /:([^]+)/, mr = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function yr(e) {
  const t = {};
  return e.replace(mr, (s) => s.startsWith("/*") ? "" : s).split(gr).forEach((s) => {
    if (s) {
      const n = s.split(vr);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function Pe(e) {
  let t = "";
  if (_e(e))
    t = e;
  else if (z(e))
    for (let s = 0; s < e.length; s++) {
      const n = Pe(e[s]);
      n && (t += n + " ");
    }
  else if (de(e))
    for (const s in e)
      e[s] && (t += s + " ");
  return t.trim();
}
const br = "itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly", _r = /* @__PURE__ */ Mn(br);
function Wo(e) {
  return !!e || e === "";
}
function wr(e, t, s) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let o = 0; n && o < e.length; o++)
    n = Ct(e[o], t[o], s);
  return n;
}
function so(e, t, s) {
  if (e.size !== t.size) return !1;
  const n = Array.from(t), o = new Uint8Array(n.length);
  for (const i of e) {
    let l = -1;
    for (let r = 0; r < n.length; r++)
      if (!o[r] && Ct(i, n[r], s)) {
        l = r;
        break;
      }
    if (l < 0) return !1;
    o[l] = 1;
  }
  return !0;
}
function Cr(e, t, s) {
  let n = Et(e), o = Et(t);
  if (n || o || (n = wt(e), o = wt(t), n || o))
    return n && o ? so(e, t, s) : !1;
  const i = Object.keys(e).length, l = Object.keys(t).length;
  if (i !== l)
    return !1;
  for (const r in e) {
    const a = e.hasOwnProperty(r), d = t.hasOwnProperty(r);
    if (a && !d || !a && d || !Ct(e[r], t[r], s))
      return !1;
  }
  return String(e) === String(t);
}
function no(e, t, s, n) {
  s || (s = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [o, i] = s;
  if (o.has(e) || i.has(t))
    return o.get(e) === t && i.get(t) === e;
  o.set(e, t), i.set(t, e);
  const l = n(e, t, s);
  return o.delete(e), i.delete(t), l;
}
function Ct(e, t, s) {
  if (e === t) return !0;
  let n = eo(e), o = eo(t);
  return n || o ? n && o ? e.getTime() === t.getTime() : !1 : (n = ct(e), o = ct(t), n || o ? e === t : (n = z(e), o = z(t), n || o ? n && o ? no(e, t, s, wr) : !1 : (n = de(e), o = de(t), n || o ? !n || !o ? !1 : no(e, t, s, Cr) : String(e) === String(t))));
}
function Fn(e, t) {
  return e.findIndex((s) => Ct(s, t));
}
const zo = (e) => !!(e && e.__v_isRef === !0), H = (e) => _e(e) ? e : e == null ? "" : z(e) || de(e) && (e.toString === Ho || !ne(e.toString)) ? zo(e) ? H(e.value) : JSON.stringify(e, Jo, 2) : String(e), Jo = (e, t) => zo(t) ? Jo(e, t.value) : Et(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (s, [n, o], i) => (s[fn(n, i) + " =>"] = o, s),
    {}
  )
} : wt(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((s) => fn(s))
} : ct(t) ? fn(t) : de(t) && !z(t) && !Ko(t) ? String(t) : t, fn = (e, t = "") => {
  var s;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    ct(e) ? `Symbol(${(s = e.description) != null ? s : t})` : e
  );
};
/**
* @vue/reactivity v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Ee;
class xr {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && Ee && (Ee.active ? (this.parent = Ee, this.index = (Ee.scopes || (Ee.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, s;
      if (this.scopes) {
        const n = this.scopes.slice();
        for (t = 0, s = n.length; t < s; t++)
          n[t].pause();
      }
      for (t = 0, s = this.effects.length; t < s; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, s;
      if (this.scopes) {
        const o = this.scopes.slice();
        for (t = 0, s = o.length; t < s; t++)
          o[t].resume();
      }
      const n = this.effects.slice();
      for (t = 0, s = n.length; t < s; t++)
        n[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const s = Ee;
      try {
        return Ee = this, t();
      } finally {
        Ee = s;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Ee, Ee = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (Ee === this)
        Ee = this.prevScope;
      else {
        let t = Ee;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let s, n;
      for (s = 0, n = this.effects.length; s < n; s++)
        this.effects[s].stop();
      for (this.effects.length = 0, s = 0, n = this.cleanups.length; s < n; s++)
        this.cleanups[s]();
      if (this.cleanups.length = 0, this.scopes) {
        const o = this.scopes.slice();
        for (s = 0, n = o.length; s < n; s++)
          o[s].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const o = this.parent.scopes.pop();
        o && o !== this && (this.parent.scopes[this.index] = o, o.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function $r() {
  return Ee;
}
let be;
const dn = /* @__PURE__ */ new WeakSet();
class Yo {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ee && (Ee.active ? Ee.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, dn.has(this) && (dn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Zo(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, oo(this), Qo(this);
    const t = be, s = Qe;
    be = this, Qe = !0;
    try {
      return this.fn();
    } finally {
      ei(this), be = t, Qe = s, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Vn(t);
      this.deps = this.depsTail = void 0, oo(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? dn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    $n(this) && this.run();
  }
  get dirty() {
    return $n(this);
  }
}
let Xo = 0, rs, ls;
function Zo(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = ls, ls = e;
    return;
  }
  e.next = rs, rs = e;
}
function Un() {
  Xo++;
}
function jn() {
  if (--Xo > 0)
    return;
  if (ls) {
    let t = ls;
    for (ls = void 0; t; ) {
      const s = t.next;
      t.next = void 0, t.flags &= -9, t = s;
    }
  }
  let e;
  for (; rs; ) {
    let t = rs;
    for (rs = void 0; t; ) {
      const s = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = s;
    }
  }
  if (e) throw e;
}
function Qo(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ei(e) {
  let t, s = e.depsTail, n = s;
  for (; n; ) {
    const o = n.prevDep;
    n.version === -1 ? (n === s && (s = o), Vn(n), kr(n)) : t = n, n.dep.activeLink = n.prevActiveLink, n.prevActiveLink = void 0, n = o;
  }
  e.deps = t, e.depsTail = s;
}
function $n(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ti(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ti(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ds) || (e.globalVersion = ds, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !$n(e))))
    return;
  e.flags |= 2;
  const t = e.dep, s = be, n = Qe;
  be = e, Qe = !0;
  try {
    Qo(e);
    const o = e.fn(e._value);
    (t.version === 0 || rt(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    be = s, Qe = n, ei(e), e.flags &= -3;
  }
}
function Vn(e, t = !1) {
  const { dep: s, prevSub: n, nextSub: o } = e;
  if (n && (n.nextSub = o, e.prevSub = void 0), o && (o.prevSub = n, e.nextSub = void 0), s.subs === e && (s.subs = n, !n && s.computed)) {
    s.computed.flags &= -5;
    for (let i = s.computed.deps; i; i = i.nextDep)
      Vn(i, !0);
  }
  !t && !--s.sc && s.map && s.map.delete(s.key);
}
function kr(e) {
  const { prevDep: t, nextDep: s } = e;
  t && (t.nextDep = s, e.prevDep = void 0), s && (s.prevDep = t, e.nextDep = void 0);
}
let Qe = !0;
const si = [];
function ut() {
  si.push(Qe), Qe = !1;
}
function ft() {
  const e = si.pop();
  Qe = e === void 0 ? !0 : e;
}
function oo(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const s = be;
    be = void 0;
    try {
      t();
    } finally {
      be = s;
    }
  }
}
let ds = 0;
class Sr {
  constructor(t, s) {
    this.sub = t, this.dep = s, this.version = s.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Bn {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!be || !Qe || be === this.computed)
      return;
    let s = this.activeLink;
    if (s === void 0 || s.sub !== be)
      s = this.activeLink = new Sr(be, this), be.deps ? (s.prevDep = be.depsTail, be.depsTail.nextDep = s, be.depsTail = s) : be.deps = be.depsTail = s, ni(s);
    else if (s.version === -1 && (s.version = this.version, s.nextDep)) {
      const n = s.nextDep;
      n.prevDep = s.prevDep, s.prevDep && (s.prevDep.nextDep = n), s.prevDep = be.depsTail, s.nextDep = void 0, be.depsTail.nextDep = s, be.depsTail = s, be.deps === s && (be.deps = n);
    }
    return s;
  }
  trigger(t) {
    this.version++, ds++, this.notify(t);
  }
  notify(t) {
    Un();
    try {
      for (let s = this.subs; s; s = s.prevSub)
        s.sub.notify() && s.sub.dep.notify();
    } finally {
      jn();
    }
  }
}
function ni(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep)
        ni(n);
    }
    const s = e.dep.subs;
    s !== e && (e.prevSub = s, s && (s.nextSub = e)), e.dep.subs = e;
  }
}
const kn = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ Symbol(
  ""
), Sn = /* @__PURE__ */ Symbol(
  ""
), ps = /* @__PURE__ */ Symbol(
  ""
);
function Ie(e, t, s) {
  if (Qe && be) {
    let n = kn.get(e);
    n || kn.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(s);
    o || (n.set(s, o = new Bn()), o.map = n, o.key = s), o.track();
  }
}
function yt(e, t, s, n, o, i) {
  const l = kn.get(e);
  if (!l) {
    ds++;
    return;
  }
  const r = (a) => {
    a && a.trigger();
  };
  if (Un(), t === "clear")
    l.forEach(r);
  else {
    const a = z(e), d = a && Dn(s);
    if (a && s === "length") {
      const u = Number(n);
      l.forEach((p, g) => {
        (g === "length" || g === ps || !ct(g) && g >= u) && r(p);
      });
    } else
      switch ((s !== void 0 || l.has(void 0)) && r(l.get(s)), d && r(l.get(ps)), t) {
        case "add":
          a ? d && r(l.get("length")) : (r(l.get(Ht)), Et(e) && r(l.get(Sn)));
          break;
        case "delete":
          a || (r(l.get(Ht)), Et(e) && r(l.get(Sn)));
          break;
        case "set":
          Et(e) && r(l.get(Ht));
          break;
      }
  }
  jn();
}
function zt(e) {
  const t = /* @__PURE__ */ ue(e);
  return t === e || (Ie(t, "iterate", ps), /* @__PURE__ */ We(e)) ? t : /* @__PURE__ */ dt(e) ? /* @__PURE__ */ Pt(e) ? t.map((s) => It(ze(s))) : t.map(It) : t.map(ze);
}
function Qs(e) {
  return Ie(e = /* @__PURE__ */ ue(e), "iterate", ps), e;
}
function nt(e, t) {
  return /* @__PURE__ */ dt(e) ? It(/* @__PURE__ */ Pt(e) ? ze(t) : t) : ze(t);
}
const Tr = {
  __proto__: null,
  [Symbol.iterator]() {
    return pn(this, Symbol.iterator, (e) => nt(this, e));
  },
  concat(...e) {
    return zt(this).concat(
      ...e.map((t) => z(t) ? zt(t) : t)
    );
  },
  entries() {
    return pn(this, "entries", (e) => (e[1] = nt(this, e[1]), e));
  },
  every(e, t) {
    return ht(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return ht(
      this,
      "filter",
      e,
      t,
      (s) => s.map((n) => nt(this, n)),
      arguments
    );
  },
  find(e, t) {
    return ht(
      this,
      "find",
      e,
      t,
      (s) => nt(this, s),
      arguments
    );
  },
  findIndex(e, t) {
    return ht(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return ht(
      this,
      "findLast",
      e,
      t,
      (s) => nt(this, s),
      arguments
    );
  },
  findLastIndex(e, t) {
    return ht(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return ht(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return hn(this, "includes", e);
  },
  indexOf(...e) {
    return hn(this, "indexOf", e);
  },
  join(e) {
    return zt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return hn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return ht(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return es(this, "pop");
  },
  push(...e) {
    return es(this, "push", e);
  },
  reduce(e, ...t) {
    return ro(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return ro(this, "reduceRight", e, t);
  },
  shift() {
    return es(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return ht(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return es(this, "splice", e);
  },
  toReversed() {
    return zt(this).toReversed();
  },
  toSorted(e) {
    return zt(this).toSorted(e);
  },
  toSpliced(...e) {
    return zt(this).toSpliced(...e);
  },
  unshift(...e) {
    return es(this, "unshift", e);
  },
  values() {
    return pn(this, "values", (e) => nt(this, e));
  }
};
function pn(e, t, s) {
  const n = Qs(e), o = n[t], i = o.call(n);
  if (n !== e && !/* @__PURE__ */ We(e)) {
    if (i[Symbol.toStringTag] === "Array Iterator") {
      const l = Object.create(Object.getPrototypeOf(i));
      return l.next = () => io(i.next(), s), o !== oi[t] && Object.defineProperties(l, {
        return: {
          get() {
            const r = i.return;
            return typeof r == "function" ? r.bind(i) : r;
          }
        },
        throw: {
          get() {
            const r = i.throw;
            return typeof r == "function" ? r.bind(i) : r;
          }
        }
      }), l;
    }
    i._next = i.next, i.next = () => io(i._next(), s);
  }
  return i;
}
function io(e, t) {
  return e.done || (e.value = t(e.value)), e;
}
const oi = Array.prototype;
function ht(e, t, s, n, o, i) {
  const l = Qs(e), r = l !== e && !/* @__PURE__ */ We(e), a = l[t];
  if (a !== oi[t]) {
    const p = a.apply(e, i);
    return r ? ze(p) : p;
  }
  let d = s;
  l !== e && (r ? d = function(p, g) {
    return s.call(this, nt(e, p), g, e);
  } : s.length > 2 && (d = function(p, g) {
    return s.call(this, p, g, e);
  }));
  const u = a.call(l, d, n);
  return r && o ? o(u) : u;
}
function ro(e, t, s, n) {
  const o = Qs(e), i = o !== e && !/* @__PURE__ */ We(e);
  let l = s, r = !1;
  o !== e && (i ? (r = n.length === 0, l = function(d, u, p) {
    return r && (r = !1, d = nt(e, d)), s.call(this, d, nt(e, u), p, e);
  }) : s.length > 3 && (l = function(d, u, p) {
    return s.call(this, d, u, p, e);
  }));
  const a = o[t](l, ...n);
  return r ? nt(e, a) : a;
}
function hn(e, t, s) {
  const n = /* @__PURE__ */ ue(e);
  Ie(n, "iterate", ps);
  const o = n[t](...s);
  return (o === -1 || o === !1) && /* @__PURE__ */ Gn(s[0]) ? (s[0] = /* @__PURE__ */ ue(s[0]), n[t](...s)) : o;
}
function es(e, t, s = []) {
  ut(), Un();
  const n = (/* @__PURE__ */ ue(e))[t].apply(e, s);
  return jn(), ft(), n;
}
const Ar = /* @__PURE__ */ Mn("__proto__,__v_isRef,__isVue"), ii = /* @__PURE__ */ new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ct)
);
function Er(e) {
  ct(e) || (e = String(e));
  const t = /* @__PURE__ */ ue(this);
  return Ie(t, "has", e), t.hasOwnProperty(e);
}
class ri {
  constructor(t = !1, s = !1) {
    this._isReadonly = t, this._isShallow = s;
  }
  get(t, s, n) {
    if (s === "__v_skip") return t.__v_skip;
    const o = this._isReadonly, i = this._isShallow;
    if (s === "__v_isReactive")
      return !o;
    if (s === "__v_isReadonly")
      return o;
    if (s === "__v_isShallow")
      return i;
    if (s === "__v_raw")
      return n === (o ? i ? Ur : ui : i ? ci : ai).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const l = z(t);
    if (!o) {
      let a;
      if (l && (a = Tr[s]))
        return a;
      if (s === "hasOwnProperty")
        return Er;
    }
    const r = Reflect.get(
      t,
      s,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Ne(t) ? t : n
    );
    if ((ct(s) ? ii.has(s) : Ar(s)) || (o || Ie(t, "get", s), i))
      return r;
    if (/* @__PURE__ */ Ne(r)) {
      const a = l && Dn(s) ? r : r.value;
      return o && de(a) ? /* @__PURE__ */ An(a) : a;
    }
    return de(r) ? o ? /* @__PURE__ */ An(r) : /* @__PURE__ */ Kn(r) : r;
  }
}
class li extends ri {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, s, n, o) {
    let i = t[s];
    const l = z(t) && Dn(s);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ dt(i);
      if (!/* @__PURE__ */ We(n) && !/* @__PURE__ */ dt(n) && (i = /* @__PURE__ */ ue(i), n = /* @__PURE__ */ ue(n)), !l && /* @__PURE__ */ Ne(i) && !/* @__PURE__ */ Ne(n))
        return d || (i.value = n), !0;
    }
    const r = l ? Number(s) < t.length : fe(t, s), a = Reflect.set(
      t,
      s,
      n,
      /* @__PURE__ */ Ne(t) ? t : o
    );
    return t === /* @__PURE__ */ ue(o) && a && (r ? rt(n, i) && yt(t, "set", s, n) : yt(t, "add", s, n)), a;
  }
  deleteProperty(t, s) {
    const n = fe(t, s);
    t[s];
    const o = Reflect.deleteProperty(t, s);
    return o && n && yt(t, "delete", s, void 0), o;
  }
  has(t, s) {
    const n = Reflect.has(t, s);
    return (!ct(s) || !ii.has(s)) && Ie(t, "has", s), n;
  }
  ownKeys(t) {
    return Ie(
      t,
      "iterate",
      z(t) ? "length" : Ht
    ), Reflect.ownKeys(t);
  }
}
class Pr extends ri {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, s) {
    return !0;
  }
  deleteProperty(t, s) {
    return !0;
  }
}
const Ir = /* @__PURE__ */ new li(), Lr = /* @__PURE__ */ new Pr(), Or = /* @__PURE__ */ new li(!0);
const Tn = (e) => e, Ps = (e) => Reflect.getPrototypeOf(e);
function Nr(e, t, s) {
  return function(...n) {
    const o = this.__v_raw, i = /* @__PURE__ */ ue(o), l = Et(i), r = e === "entries" || e === Symbol.iterator && l, a = e === "keys" && l, d = o[e](...n), u = s ? Tn : t ? It : ze;
    return !t && Ie(
      i,
      "iterate",
      a ? Sn : Ht
    ), xe(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: p, done: g } = d.next();
          return g ? { value: p, done: g } : {
            value: r ? [u(p[0]), u(p[1])] : u(p),
            done: g
          };
        }
      }
    );
  };
}
function Is(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Mr(e, t) {
  const s = {
    get(o) {
      const i = this.__v_raw, l = /* @__PURE__ */ ue(i), r = /* @__PURE__ */ ue(o);
      e || (rt(o, r) && Ie(l, "get", o), Ie(l, "get", r));
      const { has: a } = Ps(l), d = t ? Tn : e ? It : ze;
      if (a.call(l, o))
        return d(i.get(o));
      if (a.call(l, r))
        return d(i.get(r));
      i !== l && i.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && Ie(/* @__PURE__ */ ue(o), "iterate", Ht), o.size;
    },
    has(o) {
      const i = this.__v_raw, l = /* @__PURE__ */ ue(i), r = /* @__PURE__ */ ue(o);
      return e || (rt(o, r) && Ie(l, "has", o), Ie(l, "has", r)), o === r ? i.has(o) : i.has(o) || i.has(r);
    },
    forEach(o, i) {
      const l = this, r = l.__v_raw, a = /* @__PURE__ */ ue(r), d = t ? Tn : e ? It : ze;
      return !e && Ie(a, "iterate", Ht), r.forEach((u, p) => o.call(i, d(u), d(p), l));
    }
  };
  return xe(
    s,
    e ? {
      add: Is("add"),
      set: Is("set"),
      delete: Is("delete"),
      clear: Is("clear")
    } : {
      add(o) {
        const i = /* @__PURE__ */ ue(this), l = Ps(i), r = /* @__PURE__ */ ue(o), a = !t && !/* @__PURE__ */ We(o) && !/* @__PURE__ */ dt(o) ? r : o;
        return l.has.call(i, a) || rt(o, a) && l.has.call(i, o) || rt(r, a) && l.has.call(i, r) || (i.add(a), yt(i, "add", a, a)), this;
      },
      set(o, i) {
        !t && !/* @__PURE__ */ We(i) && !/* @__PURE__ */ dt(i) && (i = /* @__PURE__ */ ue(i));
        const l = /* @__PURE__ */ ue(this), { has: r, get: a } = Ps(l);
        let d = r.call(l, o);
        d || (o = /* @__PURE__ */ ue(o), d = r.call(l, o));
        const u = a.call(l, o);
        return l.set(o, i), d ? rt(i, u) && yt(l, "set", o, i) : yt(l, "add", o, i), this;
      },
      delete(o) {
        const i = /* @__PURE__ */ ue(this), { has: l, get: r } = Ps(i);
        let a = l.call(i, o);
        a || (o = /* @__PURE__ */ ue(o), a = l.call(i, o)), r && r.call(i, o);
        const d = i.delete(o);
        return a && yt(i, "delete", o, void 0), d;
      },
      clear() {
        const o = /* @__PURE__ */ ue(this), i = o.size !== 0, l = o.clear();
        return i && yt(
          o,
          "clear",
          void 0,
          void 0
        ), l;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((o) => {
    s[o] = Nr(o, e, t);
  }), s;
}
function Hn(e, t) {
  const s = Mr(e, t);
  return (n, o, i) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_isShallow" ? t : o === "__v_raw" ? n : Reflect.get(
    fe(s, o) && o in n ? s : n,
    o,
    i
  );
}
const Rr = {
  get: /* @__PURE__ */ Hn(!1, !1)
}, Dr = {
  get: /* @__PURE__ */ Hn(!1, !0)
}, Fr = {
  get: /* @__PURE__ */ Hn(!0, !1)
};
const ai = /* @__PURE__ */ new WeakMap(), ci = /* @__PURE__ */ new WeakMap(), ui = /* @__PURE__ */ new WeakMap(), Ur = /* @__PURE__ */ new WeakMap();
function jr(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function Kn(e) {
  return /* @__PURE__ */ dt(e) ? e : qn(
    e,
    !1,
    Ir,
    Rr,
    ai
  );
}
// @__NO_SIDE_EFFECTS__
function Vr(e) {
  return qn(
    e,
    !1,
    Or,
    Dr,
    ci
  );
}
// @__NO_SIDE_EFFECTS__
function An(e) {
  return qn(
    e,
    !0,
    Lr,
    Fr,
    ui
  );
}
function qn(e, t, s, n, o) {
  if (!de(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = o.get(e);
  if (i)
    return i;
  const l = jr(fr(e));
  if (l === 0)
    return e;
  const r = new Proxy(
    e,
    l === 2 ? n : s
  );
  return o.set(e, r), r;
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
  return /* @__PURE__ */ dt(e) ? /* @__PURE__ */ Pt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function dt(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function We(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Gn(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ue(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ ue(t) : e;
}
function Br(e) {
  return !fe(e, "__v_skip") && Object.isExtensible(e) && Go(e, "__v_skip", !0), e;
}
const ze = (e) => de(e) ? /* @__PURE__ */ Kn(e) : e, It = (e) => de(e) ? /* @__PURE__ */ An(e) : e;
// @__NO_SIDE_EFFECTS__
function Ne(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
  return Hr(e, !1);
}
function Hr(e, t) {
  return /* @__PURE__ */ Ne(e) ? e : new Kr(e, t);
}
class Kr {
  constructor(t, s) {
    this.dep = new Bn(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = s ? t : /* @__PURE__ */ ue(t), this._value = s ? t : ze(t), this.__v_isShallow = s;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const s = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ We(t) || /* @__PURE__ */ dt(t);
    t = n ? t : /* @__PURE__ */ ue(t), rt(t, s) && (this._rawValue = t, this._value = n ? t : ze(t), this.dep.trigger());
  }
}
function hs(e) {
  return /* @__PURE__ */ Ne(e) ? e.value : e;
}
const qr = {
  get: (e, t, s) => t === "__v_raw" ? e : hs(Reflect.get(e, t, s)),
  set: (e, t, s, n) => {
    const o = e[t];
    return /* @__PURE__ */ Ne(o) && !/* @__PURE__ */ Ne(s) ? (o.value = s, !0) : Reflect.set(e, t, s, n);
  }
};
function fi(e) {
  return /* @__PURE__ */ Pt(e) ? e : new Proxy(e, qr);
}
class Gr {
  constructor(t, s, n) {
    this.fn = t, this.setter = s, this._value = void 0, this.dep = new Bn(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ds - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !s, this.isSSR = n;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    be !== this)
      return Zo(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return ti(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Wr(e, t, s = !1) {
  let n, o;
  return ne(e) ? n = e : (n = e.get, o = e.set), new Gr(n, o, s);
}
const Ls = {}, js = /* @__PURE__ */ new WeakMap();
let jt;
function zr(e, t = !1, s = jt) {
  if (s) {
    let n = js.get(s);
    n || js.set(s, n = []), n.push(e);
  }
}
function Jr(e, t, s = ve) {
  const { immediate: n, deep: o, once: i, scheduler: l, augmentJob: r, call: a } = s, d = (S) => o ? S : /* @__PURE__ */ We(S) || o === !1 || o === 0 ? bt(S, 1) : bt(S);
  let u, p, g, b, M = !1, E = !1;
  if (/* @__PURE__ */ Ne(e) ? (p = () => e.value, M = /* @__PURE__ */ We(e)) : /* @__PURE__ */ Pt(e) ? (p = () => d(e), M = !0) : z(e) ? (E = !0, M = e.some((S) => /* @__PURE__ */ Pt(S) || /* @__PURE__ */ We(S)), p = () => e.map((S) => {
    if (/* @__PURE__ */ Ne(S))
      return S.value;
    if (/* @__PURE__ */ Pt(S))
      return d(S);
    if (ne(S))
      return a ? a(S, 2) : S();
  })) : ne(e) ? t ? p = a ? () => a(e, 2) : e : p = () => {
    if (g) {
      ut();
      try {
        g();
      } finally {
        ft();
      }
    }
    const S = jt;
    jt = u;
    try {
      return a ? a(e, 3, [b]) : e(b);
    } finally {
      jt = S;
    }
  } : p = at, t && o) {
    const S = p, K = o === !0 ? 1 / 0 : o;
    p = () => bt(S(), K);
  }
  const I = $r(), v = () => {
    u.stop(), I && I.active && Rn(I.effects, u);
  };
  if (i && t) {
    const S = t;
    t = (...K) => {
      try {
        return S(...K);
      } finally {
        v();
      }
    };
  }
  let m = E ? new Array(e.length).fill(Ls) : Ls;
  const _ = (S) => {
    if (!(!(u.flags & 1) || !u.dirty && !S))
      if (t) {
        const K = u.run();
        if (S || o || M || (E ? K.some((j, q) => rt(j, m[q])) : rt(K, m))) {
          const j = jt;
          ut();
          try {
            g && g(), jt = u;
            const q = [
              K,
              // pass undefined as the old value when it's changed for the first time
              m === Ls ? void 0 : E && m[0] === Ls ? [] : m,
              b
            ];
            m = K, a ? a(t, 3, q) : (
              // @ts-expect-error
              t(...q)
            );
          } finally {
            jt = j, ft();
          }
        }
      } else
        u.run();
  };
  return r && r(_), u = new Yo(p), u.scheduler = l ? () => l(_, !1) : _, b = (S) => zr(S, !1, u), g = u.onStop = () => {
    const S = js.get(u);
    if (S) {
      if (a)
        a(S, 4);
      else
        for (const K of S) K();
      js.delete(u);
    }
  }, t ? n ? _(!0) : m = u.run() : l ? l(_.bind(null, !0), !0) : u.run(), v.pause = u.pause.bind(u), v.resume = u.resume.bind(u), v.stop = v, v;
}
function bt(e, t = 1 / 0, s) {
  if (t <= 0 || !de(e) || e.__v_skip || (s = s || /* @__PURE__ */ new Map(), (s.get(e) || 0) >= t))
    return e;
  if (s.set(e, t), t--, /* @__PURE__ */ Ne(e))
    bt(e.value, t, s);
  else if (z(e))
    for (let n = 0; n < e.length; n++)
      bt(e[n], t, s);
  else if (wt(e) || Et(e))
    e.forEach((n) => {
      bt(n, t, s);
    });
  else if (Ko(e)) {
    for (const n in e)
      bt(e[n], t, s);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && bt(e[n], t, s);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Ts(e, t, s, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    en(o, t, s);
  }
}
function Je(e, t, s, n) {
  if (ne(e)) {
    const o = Ts(e, t, s, n);
    return o && Bo(o) && o.catch((i) => {
      en(i, t, s, void 0, !0);
    }), o;
  }
  if (z(e)) {
    const o = [];
    for (let i = 0; i < e.length; i++)
      o.push(Je(e[i], t, s, n));
    return o;
  }
}
function en(e, t, s, n = !0, o = !1) {
  const i = t ? t.vnode : null, { errorHandler: l, throwUnhandledErrorInProduction: r } = t && t.appContext.config || ve;
  if (t) {
    let a = t.parent;
    const d = t.proxy, u = `https://vuejs.org/error-reference/#runtime-${s}`;
    for (; a; ) {
      const p = a.ec;
      if (p && !a.isUnmounted && // Async failures may outlive stopped scopes whose unmount effects
      // are deferred or discarded by Suspense.
      (!o || a.scope.active)) {
        for (let g = 0; g < p.length; g++)
          if (p[g](e, d, u) === !1)
            return;
      }
      a = a.parent;
    }
    if (l) {
      ut(), Ts(l, null, 10, [
        e,
        d,
        u
      ]), ft();
      return;
    }
  }
  Yr(e, s, i, n, r);
}
function Yr(e, t, s, n = !0, o = !1) {
  if (o)
    throw e;
  console.error(e);
}
const Fe = [];
let Xe = -1;
const ot = [];
let St = null, Jt = 0;
const di = /* @__PURE__ */ Promise.resolve();
let Vs = null;
function pi(e) {
  const t = Vs || di;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Xr(e) {
  let t = Xe + 1, s = Fe.length;
  for (; t < s; ) {
    const n = t + s >>> 1, o = Fe[n], i = gs(o);
    i < e || i === e && o.flags & 2 ? t = n + 1 : s = n;
  }
  return t;
}
function tn(e) {
  if (!(e.flags & 1)) {
    const t = gs(e), s = Fe[Fe.length - 1];
    !s || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= gs(s) ? Fe.push(e) : Fe.splice(Xr(t), 0, e), e.flags |= 1, hi();
  }
}
function hi() {
  Vs || (Vs = di.then(mi));
}
function Zr(e) {
  if (!z(e))
    St && e.id === -1 ? St.splice(Jt + 1, 0, e) : e.flags & 1 || (ot.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      ot.push(e[t]);
  hi();
}
function gi(e, t, s, n = Xe + 1) {
  for (; n < Fe.length; n++) {
    const o = Fe[n];
    if (o && o.flags & 2) {
      if (e && o.id !== e.uid || t !== void 0 && !(o.id >= t))
        continue;
      Fe.splice(n, 1), n = e ? n - 1 : Xe, o.flags & 4 && (o.flags &= -2), o(), o.flags & 4 || (o.flags &= -2);
    }
  }
}
function vi(e, t, s = 0) {
  if (ot.length) {
    let n = ot, o = 0;
    if (t) {
      n = [];
      for (let l = 0; l < ot.length; l++) {
        const r = ot[l];
        (r.i !== void 0 ? !r.i || r.i.uid < s : t.has(r)) ? ot[o++] = r : n.push(r);
      }
    }
    const i = [...new Set(n)].sort((l, r) => gs(l) - gs(r));
    if (ot.length = o, St) {
      for (let l = 0; l < i.length; l++)
        St.push(i[l]);
      return;
    }
    for (St = i, Jt = 0; Jt < St.length; Jt++) {
      const l = St[Jt];
      l.flags & 4 && (l.flags &= -2), l.flags & 8 || l(), l.flags &= -2;
    }
    St = null, Jt = 0;
  }
}
let gn = !1;
function Qr(e, t) {
  if (gn) {
    e();
    return;
  }
  const s = t === void 0 ? void 0 : new Set(ot);
  e(), gn = !0;
  try {
    gi(void 0, t), vi(void 0, s, t);
  } finally {
    gn = !1;
  }
}
const gs = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function mi(e) {
  try {
    for (Xe = 0; Xe < Fe.length; Xe++) {
      const t = Fe[Xe];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Ts(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Xe < Fe.length; Xe++) {
      const t = Fe[Xe];
      t && (t.flags &= -2);
    }
    Xe = -1, Fe.length = 0, vi(), Vs = null, (Fe.length || ot.length) && mi();
  }
}
let Ge = null, yi = null;
function Bs(e) {
  const t = Ge;
  return Ge = e, yi = e && e.type.__scopeId || null, t;
}
function Wn(e, t = Ge, s) {
  if (!t || e._n)
    return e;
  const n = (...o) => {
    n._d && Gs(-1);
    const i = Bs(t), l = qt.length;
    let r;
    try {
      r = e(...o);
    } finally {
      for (let a = qt.length; a > l; a--) qi();
      Bs(i), n._d && Gs(1);
    }
    return r;
  };
  return n._n = !0, n._c = !0, n._d = !0, n;
}
function me(e, t) {
  if (Ge === null)
    return e;
  const s = ln(Ge), n = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, l, r, a = ve] = t[o];
    i && (ne(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && bt(l), n.push({
      dir: i,
      instance: s,
      value: l,
      oldValue: void 0,
      arg: r,
      modifiers: a
    }));
  }
  return e;
}
function Rt(e, t, s, n) {
  let o = e;
  if (n === "beforeMount")
    e._mount = e;
  else if (n === "beforeUpdate") {
    const r = t && t._mount;
    r && (r._latest = e, e._mount = r);
  } else if (n === "mounted") {
    const r = e._latest;
    e._mount = e._latest = void 0, r && (o = r, r._mount = void 0);
  }
  const i = o.dirs, l = t && t.dirs;
  for (let r = 0; r < i.length; r++) {
    let a = i[r];
    l ? a.oldValue = l[r].value : n === "mounted" && a.oldValue !== void 0 && (a = xe({}, a, { oldValue: void 0 }));
    let d = a.dir[n];
    d && (ut(), Je(d, s, 8, [
      e.el,
      a,
      o,
      t
    ]), ft());
  }
}
function el(e, t) {
  if (Ue) {
    let s = Ue.provides;
    const n = Ue.parent && Ue.parent.provides;
    n === s && (s = Ue.provides = Object.create(n)), s[e] = t;
  }
}
function Ds(e, t, s = !1) {
  const n = Ji();
  if (n || Xt) {
    let o = Xt ? Xt._context.provides : n ? n.parent == null || n.ce ? n.vnode.appContext && n.vnode.appContext.provides : n.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return s && ne(t) ? t.call(n && n.proxy) : t;
  }
}
const tl = /* @__PURE__ */ Symbol.for("v-scx"), sl = () => Ds(tl);
function vn(e, t, s) {
  return bi(e, t, s);
}
function bi(e, t, s = ve) {
  const { immediate: n, deep: o, flush: i, once: l } = s, r = xe({}, s), a = t && n || !t && i !== "post";
  let d;
  if (ws) {
    if (i === "sync") {
      const b = sl();
      d = b.__watcherHandles || (b.__watcherHandles = []);
    } else if (!a) {
      const b = () => {
      };
      return b.stop = at, b.resume = at, b.pause = at, b;
    }
  }
  const u = Ue;
  r.call = (b, M, E) => Je(b, u, M, E);
  let p = !1;
  i === "post" ? r.scheduler = (b) => {
    b.i = u, Re(b, u && u.suspense);
  } : i !== "sync" && (p = !0, r.scheduler = (b, M) => {
    M ? b() : tn(b);
  }), r.augmentJob = (b) => {
    t && (b.flags |= 4), p && (b.flags |= 2, u && (b.id = u.uid, b.i = u));
  };
  const g = Jr(e, t, r);
  return ws && (d ? d.push(g) : a && g()), g;
}
function nl(e, t, s) {
  const n = this.proxy, o = _e(e) ? e.includes(".") ? _i(n, e) : () => n[e] : e.bind(n, n);
  let i;
  ne(t) ? i = t : (i = t.handler, s = t);
  const l = As(this), r = bi(o, i.bind(n), s);
  return l(), r;
}
function _i(e, t) {
  const s = t.split(".");
  return () => {
    let n = e;
    for (let o = 0; o < s.length && n; o++)
      n = n[s[o]];
    return n;
  };
}
const ol = /* @__PURE__ */ Symbol("_vte"), sn = (e) => e.__isTeleport, qe = /* @__PURE__ */ Symbol("_leaveCb"), ts = /* @__PURE__ */ Symbol("_enterCb");
function il() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Nt(() => {
    e.isMounted = !0;
  }), Ti(() => {
    e.isUnmounting = !0;
  }), e;
}
const Ke = [Function, Array], wi = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Ke,
  onEnter: Ke,
  onAfterEnter: Ke,
  onEnterCancelled: Ke,
  // leave
  onBeforeLeave: Ke,
  onLeave: Ke,
  onAfterLeave: Ke,
  onLeaveCancelled: Ke,
  // appear
  onBeforeAppear: Ke,
  onAppear: Ke,
  onAfterAppear: Ke,
  onAppearCancelled: Ke
}, rl = {
  name: "BaseTransition",
  props: wi,
  setup(e, { slots: t }) {
    const s = Ji(), n = il();
    return () => {
      const o = t.default && $i(t.default(), !0), i = o && o.length ? Ci(o) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        s.subTree ? oe() : void 0
      );
      if (!i)
        return;
      const l = /* @__PURE__ */ ue(e), { mode: r } = l;
      if (n.isLeaving)
        return mn(i);
      const a = Hs(i);
      if (!a)
        return mn(i);
      const d = En(
        a,
        l,
        n,
        s
      );
      a.type !== Le && Kt(a, d);
      let u = s.subTree && Hs(s.subTree);
      if (u && u.type !== Le && !Vt(u, a) && vs(s.subTree)) {
        let p = En(
          u,
          l,
          n,
          s
        );
        if (Kt(u, p), r === "out-in" && a.type !== Le)
          return n.isLeaving = !0, p.afterLeave = () => {
            if (n.isLeaving = !1, !(s.job.flags & 8))
              if (s.effect.flags & 2) {
                const g = () => {
                  s.job.flags & 8 || s.update();
                };
                g.i = s, tn(g);
              } else
                s.update();
            delete p.afterLeave, u = void 0;
          }, mn(i);
        r === "in-out" && a.type !== Le ? p.delayLeave = (g, b, M) => {
          const E = xi(
            n,
            u
          );
          E[String(u.key)] = u, g[qe] = () => {
            b(), g[qe] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            M(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return i;
    };
  }
};
function Ci(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const s of e)
      if (s.type !== Le) {
        t = s;
        break;
      }
  }
  return t;
}
const ll = rl;
function xi(e, t) {
  const { leavingVNodes: s } = e;
  let n = s.get(t.type);
  return n || (n = /* @__PURE__ */ Object.create(null), s.set(t.type, n)), n;
}
function En(e, t, s, n) {
  const {
    appear: o,
    mode: i,
    persisted: l = !1,
    onBeforeEnter: r,
    onEnter: a,
    onAfterEnter: d,
    onEnterCancelled: u,
    onBeforeLeave: p,
    onLeave: g,
    onAfterLeave: b,
    onLeaveCancelled: M,
    onBeforeAppear: E,
    onAppear: I,
    onAfterAppear: v,
    onAppearCancelled: m
  } = t, _ = String(e.key), S = xi(s, e), K = (N, Q) => {
    N && Je(
      N,
      n,
      9,
      Q
    );
  }, j = (N, Q) => {
    const ie = Q[1];
    K(N, Q), z(N) ? N.every((ae) => ae.length <= 1) && ie() : N.length <= 1 && ie();
  }, q = {
    mode: i,
    persisted: l,
    beforeEnter(N) {
      let Q = r;
      if (!s.isMounted)
        if (o)
          Q = E || r;
        else
          return;
      N[qe] && N[qe](
        !0
        /* cancelled */
      );
      const ie = S[_];
      if (ie && Vt(e, ie)) {
        let ae = ie.el[qe];
        if (!ae) {
          const R = vs(ie);
          ae = R && R.el[qe];
        }
        ae && ae();
      }
      K(Q, [N]);
    },
    enter(N) {
      if (S[_] === e) return;
      let Q = a, ie = d, ae = u;
      if (!s.isMounted)
        if (o)
          Q = I || a, ie = v || d, ae = m || u;
        else
          return;
      let R = !1;
      N[ts] = ($e) => {
        R || (R = !0, $e ? K(ae, [N]) : K(ie, [N]), q.delayedLeave && q.delayedLeave(), N[ts] = void 0);
      };
      const re = N[ts].bind(null, !1);
      Q ? j(Q, [N, re]) : re();
    },
    leave(N, Q) {
      const ie = String(e.key);
      if (N[ts] && N[ts](
        !0
        /* cancelled */
      ), s.isUnmounting)
        return Q();
      K(p, [N]);
      let ae = !1;
      N[qe] = (re) => {
        ae || (ae = !0, Q(), re ? K(M, [N]) : K(b, [N]), N[qe] = void 0, S[ie] === e && delete S[ie]);
      };
      const R = N[qe].bind(null, !1);
      S[ie] = e, g ? j(g, [N, R]) : R();
    },
    clone(N) {
      const Q = En(N, t, s, n);
      return Q.afterLeave = () => {
        q.afterLeave && q.afterLeave();
      }, Q.delayLeave = (ie, ae, R) => {
        q.delayLeave ? q.delayLeave(ie, ae, R) : R();
      }, Q.delayedLeave = () => {
        q.delayedLeave && q.delayedLeave();
      }, Q;
    }
  };
  return q;
}
function mn(e) {
  if (nn(e))
    return e = Lt(e), e.children = null, e;
}
function Hs(e) {
  if (!nn(e))
    return sn(e.type) && e.children ? Ci(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: s } = e;
  if (s) {
    if (t & 16)
      return s[0];
    if (t & 32 && ne(s.default))
      return s.default();
  }
}
function Kt(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const s = e.component.subTree;
    Kt(
      sn(s.type) && Hs(s) || s,
      t
    );
  } else if (e.shapeFlag & 128) {
    const s = e.suspense;
    if (s) {
      const n = s.isHydrating ? s.pendingBranch : s.activeBranch;
      n && Kt(n, t.clone(n));
    } else
      e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
  } else if (e.transition = t, e.type === ye && z(e.children)) {
    const s = Li(e.children, !1);
    s && Kt(s, t);
  }
}
function $i(e, t = !1, s) {
  let n = [], o = 0;
  for (let i = 0; i < e.length; i++) {
    let l = e[i];
    const r = s == null ? l.key : String(s) + String(l.key != null ? l.key : i);
    l.type === ye ? (l.patchFlag & 128 && o++, n = n.concat(
      $i(l.children, t, r)
    )) : (t || l.type !== Le) && n.push(r != null ? Lt(l, { key: r }) : l);
  }
  if (o > 1)
    for (let i = 0; i < n.length; i++)
      n[i].patchFlag = -2;
  return n;
}
function vs(e) {
  if (e.component)
    return vs(e.component.subTree);
  if (e.type === ye) {
    const t = z(e.children) && Li(e.children, !1);
    return t ? vs(t) : void 0;
  }
  if (e.type !== Le)
    return e;
}
// @__NO_SIDE_EFFECTS__
function Ot(e, t) {
  return ne(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    xe({ name: e.name }, t, { setup: e })
  ) : e;
}
function ki(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function lo(e, t) {
  let s;
  return !!((s = Object.getOwnPropertyDescriptor(e, t)) && !s.configurable);
}
const Ks = /* @__PURE__ */ new WeakMap();
function as(e, t, s, n, o = !1) {
  if (z(e)) {
    e.forEach(
      (E, I) => as(
        E,
        t && (z(t) ? t[I] : t),
        s,
        n,
        o
      )
    );
    return;
  }
  if (cs(n) && !o) {
    n.shapeFlag & 512 && n.type.__asyncResolved && n.component.subTree.component && as(e, t, s, n.component.subTree);
    return;
  }
  const i = n.shapeFlag & 4 ? ln(n.component) : n.el, l = o ? null : i, { i: r, r: a } = e, d = t && t.r, u = r.refs === ve ? r.refs = {} : r.refs, p = r.setupState, g = /* @__PURE__ */ ue(p), b = p === ve ? Vo : (E) => lo(u, E) ? !1 : fe(g, E), M = (E, I) => !(I && lo(u, I));
  if (d != null && d !== a) {
    if (ao(t), _e(d))
      u[d] = null, b(d) && (p[d] = null);
    else if (/* @__PURE__ */ Ne(d)) {
      const E = t;
      M(d, E.k) && (d.value = null), E.k && (u[E.k] = null);
    }
  }
  if (ne(a))
    Ts(a, r, 12, [l, u]);
  else {
    const E = _e(a), I = /* @__PURE__ */ Ne(a);
    if (E || I) {
      const v = () => {
        if (e.f) {
          const m = E ? b(a) ? p[a] : u[a] : M() || !e.k ? a.value : u[e.k];
          if (o)
            z(m) && Rn(m, i);
          else if (z(m))
            m.includes(i) || m.push(i);
          else if (E)
            u[a] = [i], b(a) && (p[a] = u[a]);
          else {
            const _ = [i];
            M(a, e.k) && (a.value = _), e.k && (u[e.k] = _);
          }
        } else E ? (u[a] = l, b(a) && (p[a] = l)) : I && (M(a, e.k) && (a.value = l), e.k && (u[e.k] = l));
      };
      if (l) {
        const m = () => {
          v(), Ks.delete(e);
        };
        m.id = -1, Ks.set(e, m), Re(m, s);
      } else
        ao(e), v();
    }
  }
}
function ao(e) {
  const t = Ks.get(e);
  t && (t.flags |= 8, Ks.delete(e));
}
Zs().requestIdleCallback;
Zs().cancelIdleCallback;
const cs = (e) => !!e.type.__asyncLoader, nn = (e) => e.type.__isKeepAlive;
function al(e, t) {
  Si(e, "a", t);
}
function cl(e, t) {
  Si(e, "da", t);
}
function Si(e, t, s = Ue) {
  const n = e.__wdc || (e.__wdc = () => {
    let o = s;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (ms(t, n, s), s) {
    let o = s.parent;
    for (; o && o.parent; )
      nn(o.parent.vnode) && ul(n, t, s, o), o = o.parent;
  }
}
function ul(e, t, s, n) {
  const o = ms(
    t,
    e,
    n,
    !0
    /* prepend */
  ), i = ms(
    "um",
    () => Rn(n[t], o),
    s
  );
  i.flags = 16;
}
function ms(e, t, s = Ue, n = !1) {
  if (s) {
    const o = s[e] || (s[e] = []), i = t.__weh || (t.__weh = (...l) => {
      ut();
      const r = As(s), a = Je(t, s, e, l);
      return r(), ft(), a;
    });
    return n ? o.unshift(i) : o.push(i), i;
  }
}
const xt = (e) => (t, s = Ue) => {
  (!ws || e === "sp") && ms(e, (...n) => t(...n), s);
}, fl = xt("bm"), Nt = xt("m"), dl = xt(
  "bu"
), pl = xt("u"), Ti = xt(
  "bum"
), hl = xt("um"), gl = xt(
  "sp"
), vl = xt("rtg"), ml = xt("rtc");
function yl(e, t = Ue) {
  ms("ec", e, t);
}
const bl = /* @__PURE__ */ Symbol.for("v-ndc");
function je(e, t, s, n) {
  let o;
  const i = s, l = z(e);
  if (l || _e(e)) {
    const r = l && /* @__PURE__ */ Pt(e);
    let a = !1, d = !1;
    r && (a = !/* @__PURE__ */ We(e), d = /* @__PURE__ */ dt(e), e = Qs(e)), o = new Array(e.length);
    for (let u = 0, p = e.length; u < p; u++)
      o[u] = t(
        a ? d ? It(ze(e[u])) : ze(e[u]) : e[u],
        u,
        void 0,
        i
      );
  } else if (typeof e == "number")
    if (!Number.isInteger(e) || e < 0)
      o = [];
    else {
      o = new Array(e);
      for (let r = 0; r < e; r++)
        o[r] = t(r + 1, r, void 0, i);
    }
  else if (de(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (r, a) => t(r, a, void 0, i)
      );
    else {
      const r = Object.keys(e);
      o = new Array(r.length);
      for (let a = 0, d = r.length; a < d; a++) {
        const u = r[a];
        o[a] = t(e[u], u, a, i);
      }
    }
  else
    o = [];
  return o;
}
const Pn = (e) => e ? Yi(e) ? ln(e) : Pn(e.parent) : null, us = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ xe(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Pn(e.parent),
    $root: (e) => Pn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Ei(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      tn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = pi.bind(e.proxy)),
    $watch: (e) => nl.bind(e)
  })
), yn = (e, t) => e !== ve && !e.__isScriptSetup && fe(e, t), _l = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: s, setupState: n, data: o, props: i, accessCache: l, type: r, appContext: a } = e;
    if (t[0] !== "$") {
      const g = l[t];
      if (g !== void 0)
        switch (g) {
          case 1:
            return n[t];
          case 2:
            return o[t];
          case 4:
            return s[t];
          case 3:
            return i[t];
        }
      else {
        if (yn(n, t))
          return l[t] = 1, n[t];
        if (o !== ve && fe(o, t))
          return l[t] = 2, o[t];
        if (fe(i, t))
          return l[t] = 3, i[t];
        if (s !== ve && fe(s, t))
          return l[t] = 4, s[t];
        In && (l[t] = 0);
      }
    }
    const d = us[t];
    let u, p;
    if (d)
      return t === "$attrs" && Ie(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (u = r.__cssModules) && (u = u[t])
    )
      return u;
    if (s !== ve && fe(s, t))
      return l[t] = 4, s[t];
    if (
      // global properties
      p = a.config.globalProperties, fe(p, t)
    )
      return p[t];
  },
  set({ _: e }, t, s) {
    const { data: n, setupState: o, ctx: i } = e;
    return yn(o, t) ? (o[t] = s, !0) : n !== ve && fe(n, t) ? (n[t] = s, !0) : fe(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = s, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: s, ctx: n, appContext: o, props: i, type: l }
  }, r) {
    let a;
    return !!(s[r] || e !== ve && r[0] !== "$" && fe(e, r) || yn(t, r) || fe(i, r) || fe(n, r) || fe(us, r) || fe(o.config.globalProperties, r) || (a = l.__cssModules) && a[r]);
  },
  defineProperty(e, t, s) {
    return s.get != null ? e._.accessCache[t] = 0 : fe(s, "value") && this.set(e, t, s.value, null), Reflect.defineProperty(e, t, s);
  }
};
function co(e) {
  return z(e) ? e.reduce(
    (t, s) => (t[s] = null, t),
    {}
  ) : e;
}
let In = !0;
function wl(e) {
  const t = Ei(e), s = e.proxy, n = e.ctx;
  In = !1, t.beforeCreate && uo(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: i,
    methods: l,
    watch: r,
    provide: a,
    inject: d,
    // lifecycle
    created: u,
    beforeMount: p,
    mounted: g,
    beforeUpdate: b,
    updated: M,
    activated: E,
    deactivated: I,
    beforeDestroy: v,
    beforeUnmount: m,
    destroyed: _,
    unmounted: S,
    render: K,
    renderTracked: j,
    renderTriggered: q,
    errorCaptured: N,
    serverPrefetch: Q,
    // public API
    expose: ie,
    inheritAttrs: ae,
    // assets
    components: R,
    directives: re,
    filters: $e
  } = t;
  if (d && Cl(d, n, null), l)
    for (const Y in l) {
      const w = l[Y];
      ne(w) && (n[Y] = w.bind(s));
    }
  if (o) {
    const Y = o.call(s, s);
    de(Y) && (e.data = /* @__PURE__ */ Kn(Y));
  }
  if (In = !0, i)
    for (const Y in i) {
      const w = i[Y], O = ne(w) ? w.bind(s, s) : ne(w.get) ? w.get.bind(s, s) : at, te = !ne(w) && ne(w.set) ? w.set.bind(s) : at, ce = Cs({
        get: O,
        set: te
      });
      Object.defineProperty(n, Y, {
        enumerable: !0,
        configurable: !0,
        get: () => ce.value,
        set: (he) => ce.value = he
      });
    }
  if (r)
    for (const Y in r)
      Ai(r[Y], n, s, Y);
  if (a) {
    const Y = ne(a) ? a.call(s) : a;
    Reflect.ownKeys(Y).forEach((w) => {
      el(w, Y[w]);
    });
  }
  u && uo(u, e, "c");
  function X(Y, w) {
    z(w) ? w.forEach((O) => Y(O.bind(s))) : w && Y(w.bind(s));
  }
  if (X(fl, p), X(Nt, g), X(dl, b), X(pl, M), X(al, E), X(cl, I), X(yl, N), X(ml, j), X(vl, q), X(Ti, m), X(hl, S), X(gl, Q), z(ie))
    if (ie.length) {
      const Y = e.exposed || (e.exposed = {});
      ie.forEach((w) => {
        Object.defineProperty(Y, w, {
          get: () => s[w],
          set: (O) => s[w] = O,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  K && e.render === at && (e.render = K), ae != null && (e.inheritAttrs = ae), R && (e.components = R), re && (e.directives = re), Q && ki(e);
}
function Cl(e, t, s = at) {
  z(e) && (e = Ln(e));
  for (const n in e) {
    const o = e[n];
    let i;
    de(o) ? "default" in o ? i = Ds(
      o.from || n,
      o.default,
      !0
    ) : i = Ds(o.from || n) : i = Ds(o), /* @__PURE__ */ Ne(i) ? Object.defineProperty(t, n, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[n] = i;
  }
}
function uo(e, t, s) {
  Je(
    z(e) ? e.map((n) => n.bind(t.proxy)) : e.bind(t.proxy),
    t,
    s
  );
}
function Ai(e, t, s, n) {
  let o = n.includes(".") ? _i(s, n) : () => s[n];
  if (_e(e)) {
    const i = t[e];
    ne(i) && vn(o, i);
  } else if (ne(e))
    vn(o, e.bind(s));
  else if (de(e))
    if (z(e))
      e.forEach((i) => Ai(i, t, s, n));
    else {
      const i = ne(e.handler) ? e.handler.bind(s) : t[e.handler];
      ne(i) && vn(o, i, e);
    }
}
function Ei(e) {
  const t = e.type, { mixins: s, extends: n } = t, {
    mixins: o,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, r = i.get(t);
  let a;
  return r ? a = r : !o.length && !s && !n ? a = t : (a = {}, o.length && o.forEach(
    (d) => qs(a, d, l, !0)
  ), qs(a, t, l)), de(t) && i.set(t, a), a;
}
function qs(e, t, s, n = !1) {
  const { mixins: o, extends: i } = t;
  i && qs(e, i, s, !0), o && o.forEach(
    (l) => qs(e, l, s, !0)
  );
  for (const l in t)
    if (!(n && l === "expose")) {
      const r = xl[l] || s && s[l];
      e[l] = r ? r(e[l], t[l]) : t[l];
    }
  return e;
}
const xl = {
  data: fo,
  props: po,
  emits: po,
  // objects
  methods: ns,
  computed: ns,
  // lifecycle
  beforeCreate: Me,
  created: Me,
  beforeMount: Me,
  mounted: Me,
  beforeUpdate: Me,
  updated: Me,
  beforeDestroy: Me,
  beforeUnmount: Me,
  destroyed: Me,
  unmounted: Me,
  activated: Me,
  deactivated: Me,
  errorCaptured: Me,
  serverPrefetch: Me,
  // assets
  components: ns,
  directives: ns,
  // watch
  watch: kl,
  // provide / inject
  provide: fo,
  inject: $l
};
function fo(e, t) {
  return t ? e ? function() {
    return xe(
      ne(e) ? e.call(this, this) : e,
      ne(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function $l(e, t) {
  return ns(Ln(e), Ln(t));
}
function Ln(e) {
  if (z(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++)
      t[e[s]] = e[s];
    return t;
  }
  return e;
}
function Me(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function ns(e, t) {
  return e ? xe(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function po(e, t) {
  return e ? z(e) && z(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : xe(
    /* @__PURE__ */ Object.create(null),
    co(e),
    co(t ?? {})
  ) : t;
}
function kl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const s = xe(/* @__PURE__ */ Object.create(null), e);
  for (const n in t)
    s[n] = Me(e[n], t[n]);
  return s;
}
function Pi() {
  return {
    app: null,
    config: {
      isNativeTag: Vo,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Sl = 0;
function Tl(e, t) {
  return function(n, o = null) {
    ne(n) || (n = xe({}, n)), o != null && !de(o) && (o = null);
    const i = Pi(), l = /* @__PURE__ */ new WeakSet(), r = [];
    let a = !1;
    const d = i.app = {
      _uid: Sl++,
      _component: n,
      _props: o,
      _container: null,
      _context: i,
      _instance: null,
      version: ra,
      get config() {
        return i.config;
      },
      set config(u) {
      },
      use(u, ...p) {
        return l.has(u) || (u && ne(u.install) ? (l.add(u), u.install(d, ...p)) : ne(u) && (l.add(u), u(d, ...p))), d;
      },
      mixin(u) {
        return i.mixins.includes(u) || i.mixins.push(u), d;
      },
      component(u, p) {
        return p ? (i.components[u] = p, d) : i.components[u];
      },
      directive(u, p) {
        return p ? (i.directives[u] = p, d) : i.directives[u];
      },
      mount(u, p, g) {
        if (!a) {
          const b = d._ceVNode || Oe(n, o);
          return b.appContext = i, g === !0 ? g = "svg" : g === !1 && (g = void 0), e(b, u, g), a = !0, d._container = u, u.__vue_app__ = d, ln(b.component);
        }
      },
      onUnmount(u) {
        r.push(u);
      },
      unmount() {
        a && (Je(
          r,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(u, p) {
        return i.provides[u] = p, d;
      },
      runWithContext(u) {
        const p = Xt;
        Xt = d;
        try {
          return u();
        } finally {
          Xt = p;
        }
      }
    };
    return d;
  };
}
let Xt = null;
const Al = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ze(t)}Modifiers`] || e[`${Gt(t)}Modifiers`];
function El(e, t, ...s) {
  if (e.isUnmounted) return;
  const n = e.vnode.props || ve;
  let o = s;
  const i = t.startsWith("update:"), l = i && Al(n, t.slice(7));
  l && (l.trim && (o = s.map((u) => _e(u) ? u.trim() : u)), l.number && (o = o.map(Ss)));
  let r, a = n[r = un(t)] || // also try camelCase event handler (#2249)
  n[r = un(Ze(t))];
  !a && i && (a = n[r = un(Gt(t))]), a && Je(
    a,
    e,
    6,
    o
  );
  const d = n[r + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[r])
      return;
    e.emitted[r] = !0, Je(
      d,
      e,
      6,
      o
    );
  }
}
const Pl = /* @__PURE__ */ new WeakMap();
function Ii(e, t, s = !1) {
  const n = s ? Pl : t.emitsCache, o = n.get(e);
  if (o !== void 0)
    return o;
  const i = e.emits;
  let l = {}, r = !1;
  if (!ne(e)) {
    const a = (d) => {
      const u = Ii(d, t, !0);
      u && (r = !0, xe(l, u));
    };
    !s && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !i && !r ? (de(e) && n.set(e, null), null) : (z(i) ? i.forEach((a) => l[a] = null) : xe(l, i), de(e) && n.set(e, l), l);
}
function on(e, t) {
  return !e || !Js(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), fe(e, t[0].toLowerCase() + t.slice(1)) || fe(e, Gt(t)) || fe(e, t));
}
function ho(e) {
  const {
    type: t,
    vnode: s,
    proxy: n,
    withProxy: o,
    propsOptions: [i],
    slots: l,
    attrs: r,
    emit: a,
    render: d,
    renderCache: u,
    props: p,
    data: g,
    setupState: b,
    ctx: M,
    inheritAttrs: E
  } = e, I = Bs(e);
  let v, m;
  try {
    if (s.shapeFlag & 4) {
      const S = o || n, K = S;
      v = it(
        d.call(
          K,
          S,
          u,
          p,
          b,
          g,
          M
        )
      ), m = r;
    } else {
      const S = t;
      v = it(
        S.length > 1 ? S(
          p,
          { attrs: r, slots: l, emit: a }
        ) : S(
          p,
          null
        )
      ), m = t.props ? r : Il(r);
    }
  } catch (S) {
    qt.length = 0, en(S, e, 1), v = Oe(Le);
  }
  let _ = v;
  if (m && E !== !1) {
    const S = Object.keys(m), { shapeFlag: K } = _;
    S.length && K & 7 && (i && S.some(Ys) && (m = Ll(
      m,
      i
    )), _ = Lt(_, m, !1, !0));
  }
  if (s.dirs && (_ = Lt(_, null, !1, !0), _.dirs = _.dirs ? _.dirs.concat(s.dirs) : s.dirs), s.transition) {
    const S = sn(_.type) && Hs(_) || _;
    Kt(S, s.transition);
  }
  return v = _, Bs(I), v;
}
function Li(e, t = !0) {
  let s;
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    if (bs(o)) {
      if (o.type !== Le || o.children === "v-if") {
        if (s)
          return;
        s = o;
      }
    } else
      return;
  }
  return s;
}
const Il = (e) => {
  let t;
  for (const s in e)
    (s === "class" || s === "style" || Js(s)) && ((t || (t = {}))[s] = e[s]);
  return t;
}, Ll = (e, t) => {
  const s = {};
  for (const n in e)
    (!Ys(n) || !(n.slice(9) in t)) && (s[n] = e[n]);
  return s;
};
function Ol(e, t, s) {
  const { props: n, children: o, component: i } = e, { props: l, children: r, patchFlag: a } = t, d = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (s && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return n ? go(n, l, d) : !!l;
    if (a & 8) {
      const u = t.dynamicProps;
      for (let p = 0; p < u.length; p++) {
        const g = u[p];
        if (Oi(l, n, g) && !on(d, g))
          return !0;
      }
    }
  } else
    return (o || r) && (!r || !r.$stable) ? !0 : n === l ? !1 : n ? l ? go(n, l, d) : !0 : !!l;
  return !1;
}
function go(e, t, s) {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < n.length; o++) {
    const i = n[o];
    if (!fe(e, i) || Oi(t, e, i) && !on(s, i))
      return !0;
  }
  return !1;
}
function Oi(e, t, s) {
  const n = e[s], o = t[s];
  return s === "style" && de(n) && de(o) ? !Ct(n, o) : n !== o;
}
function Nl({ vnode: e, parent: t, suspense: s }, n) {
  for (; t; ) {
    const o = t.subTree;
    if (o.suspense && o.suspense.activeBranch === e && (o.suspense.vnode.el = o.el = n, e = o), o === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
  s && s.activeBranch === e && (s.vnode.el = n);
}
const Ni = {}, Mi = () => Object.create(Ni), Ri = (e) => Object.getPrototypeOf(e) === Ni;
function Ml(e, t, s, n = !1) {
  const o = {}, i = Mi();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Di(e, t, o, i);
  for (const l in e.propsOptions[0])
    l in o || (o[l] = void 0);
  s ? e.props = n ? o : /* @__PURE__ */ Vr(o) : e.type.props ? e.props = o : e.props = i, e.attrs = i;
}
function Rl(e, t, s, n) {
  const {
    props: o,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, r = /* @__PURE__ */ ue(o), [a] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (n || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const u = e.vnode.dynamicProps;
      for (let p = 0; p < u.length; p++) {
        let g = u[p];
        if (on(e.emitsOptions, g))
          continue;
        const b = t[g];
        if (a)
          if (fe(i, g))
            b !== i[g] && (i[g] = b, d = !0);
          else {
            const M = Ze(g);
            o[M] = On(
              a,
              r,
              M,
              b,
              e,
              !1
            );
          }
        else
          b !== i[g] && (i[g] = b, d = !0);
      }
    }
  } else {
    Di(e, t, o, i) && (d = !0);
    let u;
    for (const p in r)
      (!t || // for camelCase
      !fe(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = Gt(p)) === p || !fe(t, u))) && (a ? s && // for camelCase
      (s[p] !== void 0 || // for kebab-case
      s[u] !== void 0) && (o[p] = On(
        a,
        r,
        p,
        void 0,
        e,
        !0
      )) : delete o[p]);
    if (i !== r)
      for (const p in i)
        (!t || !fe(t, p)) && (delete i[p], d = !0);
  }
  d && yt(e.attrs, "set", "");
}
function Di(e, t, s, n) {
  const [o, i] = e.propsOptions;
  let l = !1, r;
  if (t)
    for (let a in t) {
      if (is(a))
        continue;
      const d = t[a];
      let u;
      o && fe(o, u = Ze(a)) ? !i || !i.includes(u) ? s[u] = d : (r || (r = {}))[u] = d : on(e.emitsOptions, a) || (!(a in n) || d !== n[a]) && (n[a] = d, l = !0);
    }
  if (i) {
    const a = /* @__PURE__ */ ue(s), d = r || ve;
    for (let u = 0; u < i.length; u++) {
      const p = i[u];
      s[p] = On(
        o,
        a,
        p,
        d[p],
        e,
        !fe(d, p)
      );
    }
  }
  return l;
}
function On(e, t, s, n, o, i) {
  const l = e[s];
  if (l != null) {
    const r = fe(l, "default");
    if (r && n === void 0) {
      const a = l.default;
      if (l.type !== Function && !l.skipFactory && ne(a)) {
        const { propsDefaults: d } = o;
        if (s in d)
          n = d[s];
        else {
          const u = As(o);
          n = d[s] = a.call(
            null,
            t
          ), u();
        }
      } else
        n = a;
      o.ce && o.ce._setProp(s, n);
    }
    l[
      0
      /* shouldCast */
    ] && (i && !r ? n = !1 : l[
      1
      /* shouldCastTrue */
    ] && (n === "" || n === Gt(s)) && (n = !0));
  }
  return n;
}
const Dl = /* @__PURE__ */ new WeakMap();
function Fi(e, t, s = !1) {
  const n = s ? Dl : t.propsCache, o = n.get(e);
  if (o)
    return o;
  const i = e.props, l = {}, r = [];
  let a = !1;
  if (!ne(e)) {
    const u = (p) => {
      a = !0;
      const [g, b] = Fi(p, t, !0);
      xe(l, g), b && r.push(...b);
    };
    !s && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!i && !a)
    return de(e) && n.set(e, Bt), Bt;
  if (z(i))
    for (let u = 0; u < i.length; u++) {
      const p = Ze(i[u]);
      vo(p) && (l[p] = ve);
    }
  else if (i)
    for (const u in i) {
      const p = Ze(u);
      if (vo(p)) {
        const g = i[u], b = l[p] = z(g) || ne(g) ? { type: g } : xe({}, g), M = b.type;
        let E = !1, I = !0;
        if (z(M))
          for (let v = 0; v < M.length; ++v) {
            const m = M[v], _ = ne(m) && m.name;
            if (_ === "Boolean") {
              E = !0;
              break;
            } else _ === "String" && (I = !1);
          }
        else
          E = ne(M) && M.name === "Boolean";
        b[
          0
          /* shouldCast */
        ] = E, b[
          1
          /* shouldCastTrue */
        ] = I, (E || fe(b, "default")) && r.push(p);
      }
    }
  const d = [l, r];
  return de(e) && n.set(e, d), d;
}
function vo(e) {
  return e[0] !== "$" && !is(e);
}
const zn = (e) => e === "_" || e === "_ctx" || e === "$stable", Jn = (e) => z(e) ? e.map(it) : [it(e)], Fl = (e, t, s) => {
  if (t._n)
    return t;
  const n = Wn((...o) => Jn(t(...o)), s);
  return n._c = !1, n;
}, Ui = (e, t, s) => {
  const n = e._ctx;
  for (const o in e) {
    if (zn(o)) continue;
    const i = e[o];
    if (ne(i))
      t[o] = Fl(o, i, n);
    else if (i != null) {
      const l = Jn(i);
      t[o] = () => l;
    }
  }
}, ji = (e, t) => {
  const s = Jn(t);
  e.slots.default = () => s;
}, Vi = (e, t, s) => {
  for (const n in t)
    (s || !zn(n)) && (e[n] = t[n]);
}, Ul = (e, t, s) => {
  const n = e.slots = Mi();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (Vi(n, t, s), s && Go(n, "_", o, !0)) : Ui(t, n);
  } else t && ji(e, t);
}, jl = (e, t, s) => {
  const { vnode: n, slots: o } = e;
  let i = !0, l = ve;
  if (n.shapeFlag & 32) {
    const r = t._;
    r ? s && r === 1 ? i = !1 : Vi(o, t, s) : (i = !t.$stable, Ui(t, o)), l = t;
  } else t && (ji(e, t), l = { default: 1 });
  if (i)
    for (const r in o)
      !zn(r) && l[r] == null && delete o[r];
}, Re = Gl;
function Vl(e) {
  return Bl(e);
}
function Bl(e, t) {
  const s = Zs();
  s.__VUE__ = !0;
  const {
    insert: n,
    remove: o,
    patchProp: i,
    createElement: l,
    createText: r,
    createComment: a,
    setText: d,
    setElementText: u,
    parentNode: p,
    nextSibling: g,
    setScopeId: b = at,
    insertStaticContent: M
  } = e, E = (f, h, y, P = null, $ = null, T = null, U = void 0, F = null, D = !!h.dynamicChildren) => {
    if (f === h)
      return;
    f && !Vt(f, h) && (P = L(f), he(f, $, T, !0), f = null), h.patchFlag === -2 && (D = !1, h.dynamicChildren = null), h.dynamicChildren && f && f.dynamicChildren && f.dynamicChildren.hasOnce && (h.dynamicChildren === Bt && (h.dynamicChildren = []), h.dynamicChildren.hasOnce = !0);
    const { type: k, ref: W, shapeFlag: V } = h;
    switch (k) {
      case rn:
        I(f, h, y, P);
        break;
      case Le:
        v(f, h, y, P);
        break;
      case Fs:
        f == null && m(h, y, P, U);
        break;
      case ye:
        R(
          f,
          h,
          y,
          P,
          $,
          T,
          U,
          F,
          D
        );
        break;
      default:
        V & 1 ? K(
          f,
          h,
          y,
          P,
          $,
          T,
          U,
          F,
          D
        ) : V & 6 ? re(
          f,
          h,
          y,
          P,
          $,
          T,
          U,
          F,
          D
        ) : (V & 64 || V & 128) && k.process(
          f,
          h,
          y,
          P,
          $,
          T,
          U,
          F,
          D,
          $t
        );
    }
    W != null && $ ? as(W, f && f.ref, T, h || f, !h) : W == null && f && f.ref != null && as(f.ref, null, T, f, !0);
  }, I = (f, h, y, P) => {
    if (f == null)
      n(
        h.el = r(h.children),
        y,
        P
      );
    else {
      const $ = h.el = f.el;
      h.children !== f.children && d($, h.children);
    }
  }, v = (f, h, y, P) => {
    f == null ? n(
      h.el = a(h.children || ""),
      y,
      P
    ) : h.el = f.el;
  }, m = (f, h, y, P) => {
    [f.el, f.anchor] = M(
      f.children,
      h,
      y,
      P,
      f.el,
      f.anchor
    );
  }, _ = ({ el: f, anchor: h }, y, P) => {
    let $;
    for (; f && f !== h; )
      $ = g(f), n(f, y, P), f = $;
    n(h, y, P);
  }, S = ({ el: f, anchor: h }) => {
    let y;
    for (; f && f !== h; )
      y = g(f), o(f), f = y;
    o(h);
  }, K = (f, h, y, P, $, T, U, F, D) => {
    if (h.type === "svg" ? U = "svg" : h.type === "math" && (U = "mathml"), f == null)
      j(
        h,
        y,
        P,
        $,
        T,
        U,
        F,
        D
      );
    else {
      const k = f.el && f.el._isVueCE ? f.el : null;
      try {
        k && k._beginPatch(), Q(
          f,
          h,
          $,
          T,
          U,
          F,
          D
        );
      } finally {
        k && k._endPatch();
      }
    }
  }, j = (f, h, y, P, $, T, U, F) => {
    let D, k;
    const { props: W, shapeFlag: V, transition: J, dirs: ee } = f;
    if (D = f.el = l(
      f.type,
      T,
      W && W.is,
      W
    ), V & 8 ? u(D, f.children) : V & 16 && N(
      f.children,
      D,
      null,
      P,
      $,
      bn(f, T),
      U,
      F
    ), ee && Rt(f, null, P, "created"), q(D, f, f.scopeId, U, P), W) {
      for (const ge in W)
        ge !== "value" && !is(ge) && i(D, ge, null, W[ge], T, P);
      "value" in W && i(D, "value", null, W.value, T), (k = W.onVnodeBeforeMount) && st(k, P, f);
    }
    ee && Rt(f, null, P, "beforeMount");
    const le = Hl($, J);
    le ? J.beforeEnter(D) : J && !J.persisted && (D[ql] = !0), n(D, h, y), ((k = W && W.onVnodeMounted) || le || ee) && Re(() => {
      try {
        k && st(k, P, f), le && J.enter(D), ee && Rt(f, null, P, "mounted");
      } finally {
      }
    }, $);
  }, q = (f, h, y, P, $) => {
    if (y && b(f, y), P)
      for (let T = 0; T < P.length; T++)
        b(f, P[T]);
    if ($) {
      let T = $.subTree;
      if (h === T || Ki(T.type) && (T.ssContent === h || T.ssFallback === h)) {
        const U = $.vnode;
        q(
          f,
          U,
          U.scopeId,
          U.slotScopeIds,
          $.parent
        );
      }
    }
  }, N = (f, h, y, P, $, T, U, F, D = 0) => {
    for (let k = D; k < f.length; k++) {
      const W = f[k] = F ? mt(f[k]) : it(f[k]);
      E(
        null,
        W,
        h,
        y,
        P,
        $,
        T,
        U,
        F
      );
    }
  }, Q = (f, h, y, P, $, T, U) => {
    const F = h.el = f.el;
    let { patchFlag: D, dynamicChildren: k, dirs: W } = h;
    D |= f.patchFlag & 16;
    const V = f.props || ve, J = h.props || ve;
    let ee;
    if (y && Dt(y, !1), (ee = J.onVnodeBeforeUpdate) && st(ee, y, h, f), W && Rt(h, f, y, "beforeUpdate"), y && Dt(y, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    k && (!f.dynamicChildren || f.dynamicChildren.length !== k.length) && (D = 0, U = !1, k = null), (V.innerHTML && J.innerHTML == null || V.textContent && J.textContent == null) && u(F, ""), k ? ie(
      f.dynamicChildren,
      k,
      F,
      y,
      P,
      bn(h, $),
      T
    ) : U || w(
      f,
      h,
      F,
      null,
      y,
      P,
      bn(h, $),
      T,
      !1
    ), D > 0) {
      if (D & 16)
        ae(F, V, J, y, $);
      else if (D & 2 && V.class !== J.class && i(F, "class", null, J.class, $), D & 4 && i(F, "style", V.style, J.style, $), D & 8) {
        const le = h.dynamicProps;
        for (let ge = 0; ge < le.length; ge++) {
          const pe = le[ge], ke = V[pe], Ae = J[pe];
          (Ae !== ke || pe === "value") && i(F, pe, ke, Ae, $, y);
        }
      }
      D & 1 && f.children !== h.children && u(F, h.children);
    } else !U && k == null && ae(F, V, J, y, $);
    ((ee = J.onVnodeUpdated) || W) && Re(() => {
      ee && st(ee, y, h, f), W && Rt(h, f, y, "updated");
    }, P);
  }, ie = (f, h, y, P, $, T, U) => {
    for (let F = 0; F < h.length; F++) {
      const D = f[F], k = h[F], W = D.el || fs(D), V = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        W && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (D.type === ye || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Vt(D, k) || // - In the case of a component, it could contain anything.
        D.shapeFlag & 198) ? p(W) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          y
        )
      );
      E(
        D,
        k,
        V,
        null,
        P,
        $,
        T,
        U,
        !0
      );
    }
  }, ae = (f, h, y, P, $) => {
    if (h !== y) {
      if (h !== ve)
        for (const T in h)
          !is(T) && !(T in y) && i(
            f,
            T,
            h[T],
            null,
            $,
            P
          );
      for (const T in y) {
        if (is(T)) continue;
        const U = y[T], F = h[T];
        U !== F && T !== "value" && i(f, T, F, U, $, P);
      }
      "value" in y && i(f, "value", h.value, y.value, $);
    }
  }, R = (f, h, y, P, $, T, U, F, D) => {
    const k = h.el = f ? f.el : r(""), W = h.anchor = f ? f.anchor : r("");
    let { patchFlag: V, dynamicChildren: J, slotScopeIds: ee } = h;
    ee && (F = F ? F.concat(ee) : ee), f == null ? (n(k, y, P), n(W, y, P), N(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      h.children || [],
      y,
      W,
      $,
      T,
      U,
      F,
      D
    )) : V > 0 && V & 64 && J && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    f.dynamicChildren && f.dynamicChildren.length === J.length ? (ie(
      f.dynamicChildren,
      J,
      y,
      $,
      T,
      U,
      F
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (h.key != null || $ && h === $.subTree) && Bi(
      f,
      h,
      !0
      /* shallow */
    )) : w(
      f,
      h,
      y,
      W,
      $,
      T,
      U,
      F,
      D
    );
  }, re = (f, h, y, P, $, T, U, F, D) => {
    h.slotScopeIds = F, f == null ? h.shapeFlag & 512 ? $.ctx.activate(
      h,
      y,
      P,
      U,
      D
    ) : $e(
      h,
      y,
      P,
      $,
      T,
      U,
      D
    ) : Z(f, h, D);
  }, $e = (f, h, y, P, $, T, U) => {
    const F = f.component = Ql(
      f,
      P,
      $
    );
    if (nn(f) && (F.ctx.renderer = $t), ea(F, !1, U), F.asyncDep) {
      if ($ && $.registerDep(
        F,
        X,
        U,
        T
      ), !f.el) {
        const D = F.subTree = Oe(Le);
        v(null, D, h, y), f.placeholder = D.el;
      }
    } else
      X(
        F,
        f,
        h,
        y,
        $,
        T,
        U
      );
  }, Z = (f, h, y) => {
    const P = h.component = f.component;
    if (Ol(f, h, y))
      if (P.asyncDep && !P.asyncResolved) {
        h.el = f.el, h.placeholder = f.placeholder, Y(P, h, y);
        return;
      } else
        P.next = h, P.update();
    else
      h.el = f.el, h.placeholder = f.placeholder, P.vnode = h;
  }, X = (f, h, y, P, $, T, U) => {
    const F = () => {
      if (f.isMounted) {
        let { next: V, bu: J, u: ee, parent: le, vnode: ge } = f;
        {
          const et = Hi(f);
          if (et) {
            V && (V.el = ge.el, Y(f, V, U)), et.asyncDep.then(() => {
              const pt = () => {
                f.job.flags & 8 || ($ && $.pendingBranch ? Re(pt, $) : k());
              };
              pt.flags = 48, Re(pt, $);
            });
            return;
          }
        }
        let pe = V, ke;
        Dt(f, !1), V ? (V.el = ge.el, Y(f, V, U)) : V = ge, J && Rs(J), (ke = V.props && V.props.onVnodeBeforeUpdate) && st(ke, le, V, ge), Dt(f, !0);
        const Ae = ho(f), Ye = f.subTree;
        f.subTree = Ae, E(
          Ye,
          Ae,
          // parent may have changed if it's in a teleport. a root that is a
          // pending async component only has its placeholder comment
          p(
            Ye.el || fs(Ye)
          ),
          // anchor may have changed if it's in a fragment
          L(Ye),
          f,
          $,
          T
        ), V.el = Ae.el, pe === null && Nl(f, Ae.el), ee && Re(ee, $), (ke = V.props && V.props.onVnodeUpdated) && Re(
          () => st(ke, le, V, ge),
          $
        );
      } else {
        let V;
        const { el: J, props: ee } = h, { bm: le, m: ge, parent: pe, root: ke, type: Ae } = f, Ye = cs(h);
        Dt(f, !1), le && Rs(le), !Ye && (V = ee && ee.onVnodeBeforeMount) && st(V, pe, h), Dt(f, !0);
        {
          ke.ce && ke.ce._hasShadowRoot() && ke.ce._injectChildStyle(
            Ae,
            f.parent ? f.parent.type : void 0
          );
          const et = f.subTree = ho(f);
          E(
            null,
            et,
            y,
            P,
            f,
            $,
            T
          ), h.el = et.el;
        }
        if (ge && Re(ge, $), !Ye && (V = ee && ee.onVnodeMounted)) {
          const et = h;
          Re(
            () => st(V, pe, et),
            $
          );
        }
        (h.shapeFlag & 256 || pe && cs(pe.vnode) && pe.vnode.shapeFlag & 256) && f.a && Re(f.a, $), f.isMounted = !0, h = y = P = null;
      }
    };
    f.scope.on();
    const D = f.effect = new Yo(F);
    f.scope.off();
    const k = f.update = D.run.bind(D), W = f.job = D.runIfDirty.bind(D);
    W.i = f, W.id = f.uid, D.scheduler = () => tn(W), Dt(f, !0), k();
  }, Y = (f, h, y) => {
    h.component = f;
    const P = f.vnode.props;
    f.vnode = h, f.next = null, Rl(f, h.props, P, y), jl(f, h.children, y), ut(), gi(f), ft();
  }, w = (f, h, y, P, $, T, U, F, D = !1) => {
    const k = f && f.children, W = f ? f.shapeFlag : 0, V = h.children, { patchFlag: J, shapeFlag: ee } = h;
    if (J > 0) {
      if (J & 128) {
        te(
          k,
          V,
          y,
          P,
          $,
          T,
          U,
          F,
          D
        );
        return;
      } else if (J & 256) {
        O(
          k,
          V,
          y,
          P,
          $,
          T,
          U,
          F,
          D
        );
        return;
      }
    }
    ee & 8 ? (W & 16 && C(k, $, T), V !== k && u(y, V)) : W & 16 ? ee & 16 ? te(
      k,
      V,
      y,
      P,
      $,
      T,
      U,
      F,
      D
    ) : C(k, $, T, !0) : (W & 8 && u(y, ""), ee & 16 && N(
      V,
      y,
      P,
      $,
      T,
      U,
      F,
      D
    ));
  }, O = (f, h, y, P, $, T, U, F, D) => {
    f = f || Bt, h = h || Bt;
    const k = f.length, W = h.length, V = Math.min(k, W);
    let J;
    for (J = 0; J < V; J++) {
      const ee = h[J] = D ? mt(h[J]) : it(h[J]);
      E(
        f[J],
        ee,
        y,
        null,
        $,
        T,
        U,
        F,
        D
      );
    }
    k > W ? C(
      f,
      $,
      T,
      !0,
      !1,
      V
    ) : N(
      h,
      y,
      P,
      $,
      T,
      U,
      F,
      D,
      V
    );
  }, te = (f, h, y, P, $, T, U, F, D) => {
    let k = 0;
    const W = h.length;
    let V = f.length - 1, J = W - 1;
    for (; k <= V && k <= J; ) {
      const ee = f[k], le = h[k] = D ? mt(h[k]) : it(h[k]);
      if (Vt(ee, le))
        E(
          ee,
          le,
          y,
          null,
          $,
          T,
          U,
          F,
          D
        );
      else
        break;
      k++;
    }
    for (; k <= V && k <= J; ) {
      const ee = f[V], le = h[J] = D ? mt(h[J]) : it(h[J]);
      if (Vt(ee, le))
        E(
          ee,
          le,
          y,
          null,
          $,
          T,
          U,
          F,
          D
        );
      else
        break;
      V--, J--;
    }
    if (k > V) {
      if (k <= J) {
        const ee = J + 1, le = ee < W ? h[ee].el : P;
        for (; k <= J; )
          E(
            null,
            h[k] = D ? mt(h[k]) : it(h[k]),
            y,
            le,
            $,
            T,
            U,
            F,
            D
          ), k++;
      }
    } else if (k > J)
      for (; k <= V; )
        he(f[k], $, T, !0), k++;
    else {
      const ee = k, le = k, ge = /* @__PURE__ */ new Map();
      for (k = le; k <= J; k++) {
        const Ve = h[k] = D ? mt(h[k]) : it(h[k]);
        Ve.key != null && ge.set(Ve.key, k);
      }
      let pe, ke = 0;
      const Ae = J - le + 1;
      let Ye = !1, et = 0;
      const pt = new Array(Ae);
      for (k = 0; k < Ae; k++) pt[k] = 0;
      for (k = ee; k <= V; k++) {
        const Ve = f[k];
        if (ke >= Ae) {
          he(Ve, $, T, !0);
          continue;
        }
        let tt;
        if (Ve.key != null)
          tt = ge.get(Ve.key);
        else
          for (pe = le; pe <= J; pe++)
            if (pt[pe - le] === 0 && Vt(Ve, h[pe])) {
              tt = pe;
              break;
            }
        tt === void 0 ? he(Ve, $, T, !0) : (pt[tt - le] = k + 1, tt >= et ? et = tt : Ye = !0, E(
          Ve,
          h[tt],
          y,
          null,
          $,
          T,
          U,
          F,
          D
        ), ke++);
      }
      const Xn = Ye ? Kl(pt) : Bt;
      for (pe = Xn.length - 1, k = Ae - 1; k >= 0; k--) {
        const Ve = le + k, tt = h[Ve], Zn = h[Ve + 1], Qn = Ve + 1 < W ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Zn.el || fs(Zn)
        ) : P;
        pt[k] === 0 ? E(
          null,
          tt,
          y,
          Qn,
          $,
          T,
          U,
          F,
          D
        ) : Ye && (pe < 0 || k !== Xn[pe] ? ce(tt, y, Qn, 2) : pe--);
      }
    }
  }, ce = (f, h, y, P, $ = null) => {
    const { el: T, type: U, transition: F, children: D, shapeFlag: k } = f;
    if (k & 6) {
      ce(f.component.subTree, h, y, P);
      return;
    }
    if (k & 128) {
      f.suspense.move(h, y, P);
      return;
    }
    if (k & 64) {
      U.move(f, h, y, $t);
      return;
    }
    if (U === ye) {
      n(T, h, y);
      for (let V = 0; V < D.length; V++)
        ce(D[V], h, y, P);
      n(f.anchor, h, y);
      return;
    }
    if (U === Fs) {
      _(f, h, y);
      return;
    }
    if (P !== 2 && k & 1 && F)
      if (P === 0)
        F.persisted && !T[qe] ? n(T, h, y) : (F.beforeEnter(T), n(T, h, y), Re(() => F.enter(T), $));
      else {
        const { leave: V, delayLeave: J, afterLeave: ee } = F, le = () => {
          f.ctx.isUnmounted ? o(T) : n(T, h, y);
        }, ge = () => {
          const pe = T._isLeaving || !!T[qe];
          T._isLeaving && T[qe](
            !0
            /* cancelled */
          ), F.persisted && !pe ? le() : V(T, () => {
            le(), ee && ee();
          });
        };
        J ? J(T, le, ge) : ge();
      }
    else
      n(T, h, y);
  }, he = (f, h, y, P = !1, $ = !1) => {
    const {
      type: T,
      props: U,
      ref: F,
      children: D,
      dynamicChildren: k,
      shapeFlag: W,
      patchFlag: V,
      dirs: J,
      cacheIndex: ee,
      memo: le
    } = f;
    if ((V === -2 || k && k.hasOnce) && ($ = !1), F != null && (ut(), as(F, null, y, f, !0), ft()), ee != null && (!f.ctx || f.ctx === h) && (h.renderCache[ee] = void 0), W & 256 && h.ctx.deactivate(f))
      return;
    const ge = W & 1 && J, pe = !cs(f);
    let ke;
    if (pe && (ke = U && U.onVnodeBeforeUnmount) && st(ke, h, f), W & 6)
      G(f.component, y, P);
    else {
      if (W & 128) {
        f.suspense.unmount(y, P);
        return;
      }
      ge && Rt(f, null, h, "beforeUnmount"), W & 64 ? f.type.remove(
        f,
        h,
        y,
        $t,
        P
      ) : k && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !k.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (T !== ye || V > 0 && V & 64) ? C(
        k,
        h,
        y,
        !1,
        !0
      ) : (T === ye && V & 384 || !$ && W & 16) && C(D, h, y), P && Te(f);
    }
    const Ae = le != null && ee == null;
    (pe && (ke = U && U.onVnodeUnmounted) || ge || Ae) && Re(() => {
      ke && st(ke, h, f), ge && Rt(f, null, h, "unmounted"), Ae && (f.el = null);
    }, y);
  }, Te = (f) => {
    const { type: h, el: y, anchor: P, transition: $ } = f, T = h === ye;
    if (T && !$) {
      se(y, P);
      return;
    }
    if (h === Fs) {
      S(f), $ && !$.persisted && $.afterLeave && $.afterLeave();
      return;
    }
    const U = T ? vs(f) : f, F = () => {
      T ? p(y) && se(y, P) : o(y), $ && !$.persisted && $.afterLeave && $.afterLeave();
    };
    if (U && U.shapeFlag & 1 && $ && !$.persisted) {
      const { leave: D, delayLeave: k } = $, W = U.el, V = () => D(W, F);
      k ? k(W, F, V) : V();
    } else
      F();
  }, se = (f, h) => {
    let y;
    for (; f !== h; )
      y = g(f), o(f), f = y;
    o(h);
  }, G = (f, h, y) => {
    const { bum: P, scope: $, job: T, subTree: U, um: F, m: D, a: k } = f;
    mo(D), mo(k), P && Rs(P), $.stop(), T ? (T.flags |= 8, he(U, f, h, y)) : U && (U.transition = f.vnode.transition, he(U, f, h, y)), F && Re(F, h);
    const W = () => {
      f.isUnmounted = !0;
    };
    W.flags = 16, Re(W, h);
  }, C = (f, h, y, P = !1, $ = !1, T = 0) => {
    for (let U = T; U < f.length; U++)
      he(f[U], h, y, P, $);
  }, L = (f) => {
    if (f.shapeFlag & 6)
      return L(f.component.subTree);
    if (f.shapeFlag & 128)
      return f.suspense.next();
    const h = g(f.anchor || f.el), y = h && h[ol];
    return y ? g(y) : h;
  }, we = (f, h, y) => {
    const P = f && h._vnode ? void 0 : f && f.component ? f.component.uid : Zl();
    Qr(() => {
      f == null ? h._vnode && he(h._vnode, null, null, !0) : E(
        h._vnode || null,
        f,
        h,
        null,
        null,
        null,
        y
      ), h._vnode = f;
    }, P);
  }, $t = {
    p: E,
    um: he,
    m: ce,
    r: Te,
    mt: $e,
    mc: N,
    pc: w,
    pbc: ie,
    n: L,
    o: e
  };
  return {
    render: we,
    hydrate: void 0,
    createApp: Tl(we)
  };
}
function bn({ type: e, props: t }, s) {
  return s === "svg" && e === "foreignObject" || s === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : s;
}
function Dt({ effect: e, job: t }, s) {
  s ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Hl(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Bi(e, t, s = !1) {
  const n = e.children, o = t.children;
  if (z(n) && z(o))
    for (let i = 0; i < n.length; i++) {
      const l = n[i];
      let r = o[i];
      r.shapeFlag & 1 && !r.dynamicChildren && ((r.patchFlag <= 0 || r.patchFlag === 32) && (r = o[i] = mt(o[i]), r.el = l.el), !s && r.patchFlag !== -2 && Bi(l, r)), r.type === rn && (r.patchFlag === -1 && (r = o[i] = mt(r)), r.el = l.el), r.type === Le && !r.el && (r.el = l.el);
    }
}
function Kl(e) {
  const t = e.slice(), s = [0];
  let n, o, i, l, r;
  const a = e.length;
  for (n = 0; n < a; n++) {
    const d = e[n];
    if (d !== 0) {
      if (o = s[s.length - 1], e[o] < d) {
        t[n] = o, s.push(n);
        continue;
      }
      for (i = 0, l = s.length - 1; i < l; )
        r = i + l >> 1, e[s[r]] < d ? i = r + 1 : l = r;
      d < e[s[i]] && (i > 0 && (t[n] = s[i - 1]), s[i] = n);
    }
  }
  for (i = s.length, l = s[i - 1]; i-- > 0; )
    s[i] = l, l = t[l];
  return s;
}
function Hi(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Hi(t);
}
function mo(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function fs(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  if (t)
    return fs(t.subTree);
  const s = e.suspense;
  return s && s.activeBranch ? fs(s.activeBranch) : null;
}
const Ki = (e) => e.__isSuspense, ql = /* @__PURE__ */ Symbol("_deferredEnter");
function Gl(e, t) {
  t && t.pendingBranch ? z(e) ? t.effects.push(...e) : t.effects.push(e) : Zr(e);
}
const ye = /* @__PURE__ */ Symbol.for("v-fgt"), rn = /* @__PURE__ */ Symbol.for("v-txt"), Le = /* @__PURE__ */ Symbol.for("v-cmt"), Fs = /* @__PURE__ */ Symbol.for("v-stc"), qt = [];
let He = null;
function x(e = !1) {
  qt.push(He = e ? null : []);
}
function qi() {
  qt.pop(), He = qt[qt.length - 1] || null;
}
let ys = 1;
function Gs(e, t = !1) {
  ys += e, e < 0 && He && t && (He.hasOnce = !0);
}
function Gi(e) {
  return e.dynamicChildren = ys > 0 ? He || Bt : null, qi(), ys > 0 && He && He.push(e), e;
}
function A(e, t, s, n, o, i) {
  return Gi(
    c(
      e,
      t,
      s,
      n,
      o,
      i,
      !0
    )
  );
}
function Tt(e, t, s, n, o) {
  return Gi(
    Oe(
      e,
      t,
      s,
      n,
      o,
      !0
    )
  );
}
function bs(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Vt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Wi = ({ key: e }) => e ?? null, Us = ({
  ref: e,
  ref_key: t,
  ref_for: s
}) => (typeof e == "number" && (e = "" + e), e != null ? _e(e) || /* @__PURE__ */ Ne(e) || ne(e) ? { i: Ge, r: e, k: t, f: !!s } : e : null);
function c(e, t = null, s = null, n = 0, o = null, i = e === ye ? 0 : 1, l = !1, r = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Wi(t),
    ref: t && Us(t),
    scopeId: yi,
    slotScopeIds: null,
    children: s,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: n,
    dynamicProps: o,
    dynamicChildren: null,
    appContext: null,
    ctx: Ge
  };
  return r ? (Ws(a, s), i & 128 && e.normalize(a)) : s && (a.shapeFlag |= _e(s) ? 8 : 16), ys > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  He && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && He.push(a), a;
}
const Oe = Wl;
function Wl(e, t = null, s = null, n = 0, o = null, i = !1) {
  if ((!e || e === bl) && (e = Le), bs(e)) {
    const r = Lt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return s && Ws(r, s), ys > 0 && !i && He && (r.shapeFlag & 6 ? He[He.indexOf(e)] = r : He.push(r)), r.patchFlag = -2, r;
  }
  if (oa(e) && (e = e.__vccOpts), t) {
    t = zl(t);
    let { class: r, style: a } = t;
    r && !_e(r) && (t.class = Pe(r)), de(a) && (/* @__PURE__ */ Gn(a) && !z(a) && (a = xe({}, a)), t.style = Yt(a));
  }
  const l = _e(e) ? 1 : Ki(e) ? 128 : sn(e) ? 64 : de(e) ? 4 : ne(e) ? 2 : 0;
  return c(
    e,
    t,
    s,
    n,
    o,
    l,
    i,
    !0
  );
}
function zl(e) {
  return e ? /* @__PURE__ */ Gn(e) ? xe({}, e) : Ri(e) ? xe({}, e[Zi] || e) : e : null;
}
function Lt(e, t, s = !1, n = !1) {
  const { props: o, ref: i, patchFlag: l, children: r, transition: a } = e, d = t ? Yl(o || {}, t) : o, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && Wi(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      s && i ? z(i) ? i.concat(Us(t)) : [i, Us(t)] : Us(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: r,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== ye ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Lt(e.ssContent),
    ssFallback: e.ssFallback && Lt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return a && n && Kt(
    u,
    a.clone(u)
  ), u;
}
function Be(e = " ", t = 0) {
  return Oe(rn, null, e, t);
}
function Jl(e, t) {
  const s = Oe(Fs, null, e);
  return s.staticCount = t, s;
}
function oe(e = "", t = !1) {
  return t ? (x(), Tt(Le, null, e)) : Oe(Le, null, e);
}
function it(e) {
  return e == null || typeof e == "boolean" ? Oe(Le) : z(e) ? Oe(
    ye,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : bs(e) ? mt(e) : Oe(rn, null, String(e));
}
function mt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Lt(e);
}
function Ws(e, t) {
  let s = 0;
  const { shapeFlag: n } = e;
  if (t == null)
    t = null;
  else if (z(t))
    s = 16;
  else if (typeof t == "object")
    if (n & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), Ws(e, o()), o._c && (o._d = !0));
      return;
    } else {
      s = 32;
      const o = t._;
      !o && !Ri(t) ? t._ctx = Ge : o === 3 && Ge && (Ge.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (ne(t)) {
    if (n & 65) {
      Ws(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ge }, s = 32;
  } else
    t = String(t), n & 64 ? (s = 16, t = [Be(t)]) : s = 8;
  e.children = t, e.shapeFlag |= s;
}
function Yl(...e) {
  const t = {};
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    for (const o in n)
      if (o === "class")
        t.class !== n.class && (t.class = Pe([t.class, n.class]));
      else if (o === "style")
        t.style = Yt([t.style, n.style]);
      else if (Js(o)) {
        const i = t[o], l = n[o];
        l && i !== l && !(z(i) && i.includes(l)) ? t[o] = i ? [].concat(i, l) : l : l == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Ys(o) && (t[o] = l);
      } else o !== "" && (t[o] = n[o]);
  }
  return t;
}
function st(e, t, s, n = null) {
  Je(e, t, 7, [
    s,
    n
  ]);
}
const Xl = /* @__PURE__ */ Pi();
let zi = 0;
function Zl() {
  return zi;
}
function Ql(e, t, s) {
  const n = e.type, o = (t ? t.appContext : e.appContext) || Xl, i = {
    uid: zi++,
    vnode: e,
    type: n,
    parent: t,
    appContext: o,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new xr(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(o.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Fi(n, o),
    emitsOptions: Ii(n, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ve,
    // inheritAttrs
    inheritAttrs: n.inheritAttrs,
    // state
    ctx: ve,
    data: ve,
    props: ve,
    attrs: ve,
    slots: ve,
    refs: ve,
    setupState: ve,
    setupContext: null,
    // suspense related
    suspense: s,
    suspenseId: s ? s.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = El.bind(null, i), e.ce && e.ce(i), i;
}
let Ue = null;
const Ji = () => Ue || Ge;
let zs, _s;
{
  const e = Zs(), t = (s, n) => {
    let o;
    return (o = e[s]) || (o = e[s] = []), o.push(n), (i) => {
      o.length > 1 ? o.forEach((l) => l(i)) : o[0](i);
    };
  };
  zs = t(
    "__VUE_INSTANCE_SETTERS__",
    (s) => Ue = s
  ), _s = t(
    "__VUE_SSR_SETTERS__",
    (s) => ws = s
  );
}
const As = (e) => {
  const t = Ue;
  return zs(e), e.scope.on(), () => {
    e.scope.off(), zs(t);
  };
}, yo = () => {
  Ue && Ue.scope.off(), zs(null);
};
function Yi(e) {
  return e.vnode.shapeFlag & 4;
}
let ws = !1;
function ea(e, t = !1, s = !1) {
  t && _s(t);
  const { props: n, children: o } = e.vnode, i = Yi(e);
  Ml(e, n, i, t), Ul(e, o, s || t);
  const l = i ? ta(e, t) : void 0;
  return t && _s(!1), l;
}
function ta(e, t) {
  const s = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, _l);
  const { setup: n } = s;
  if (n) {
    ut();
    const o = e.setupContext = n.length > 1 ? na(e) : null, i = As(e), l = Ts(
      n,
      e,
      0,
      [
        e.props,
        o
      ]
    ), r = Bo(l);
    if (ft(), i(), (r || e.sp) && !cs(e) && ki(e), r) {
      if (l.then(yo, yo), t)
        return l.then((a) => {
          _s(!0);
          try {
            bo(e, a, t);
          } finally {
            _s(!1);
          }
        }).catch((a) => {
          en(a, e, 0, void 0, !0), e.ssrRender = (d, u) => u("<!---->");
        });
      e.asyncDep = l;
    } else
      bo(e, l);
  } else
    Xi(e);
}
function bo(e, t, s) {
  ne(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : de(t) && (e.setupState = fi(t)), Xi(e);
}
function Xi(e, t, s) {
  const n = e.type;
  e.render || (e.render = n.render || at);
  {
    const o = As(e);
    ut();
    try {
      wl(e);
    } finally {
      ft(), o();
    }
  }
}
const Zi = /* @__PURE__ */ Symbol(), sa = {
  get(e, t) {
    return Ie(e, "get", ""), t === Zi ? e : e[t];
  }
};
function na(e) {
  const t = (s) => {
    e.exposed = s || {};
  };
  return {
    attrs: new Proxy(e.attrs, sa),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function ln(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(fi(Br(e.exposed)), {
    get(t, s) {
      if (s in t)
        return t[s];
      if (s in us)
        return us[s](e);
    },
    has(t, s) {
      return s in t || s in us;
    }
  })) : e.proxy;
}
function oa(e) {
  return ne(e) && "__vccOpts" in e;
}
const Cs = (e, t) => /* @__PURE__ */ Wr(e, t, ws);
function ia(e, t, s) {
  try {
    Gs(-1);
    const n = arguments.length;
    return n === 2 ? de(t) && !z(t) ? bs(t) ? Oe(e, null, [t]) : Oe(e, t) : Oe(e, null, t) : (n > 3 ? s = Array.prototype.slice.call(arguments, 2) : n === 3 && bs(s) && (s = [s]), Oe(e, t, s));
  } finally {
    Gs(1);
  }
}
const ra = "3.5.45";
/**
* @vue/runtime-dom v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Nn;
const _o = typeof window < "u" && window.trustedTypes;
if (_o)
  try {
    Nn = /* @__PURE__ */ _o.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Qi = Nn ? (e) => Nn.createHTML(e) : (e) => e, la = "http://www.w3.org/2000/svg", aa = "http://www.w3.org/1998/Math/MathML", vt = typeof document < "u" ? document : null, wo = vt && /* @__PURE__ */ vt.createElement("template"), ca = {
  insert: (e, t, s) => {
    t.insertBefore(e, s || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, s, n) => {
    const o = t === "svg" ? vt.createElementNS(la, e) : t === "mathml" ? vt.createElementNS(aa, e) : s ? vt.createElement(e, { is: s }) : vt.createElement(e);
    return e === "select" && n && n.multiple != null && o.setAttribute("multiple", n.multiple), o;
  },
  createText: (e) => vt.createTextNode(e),
  createComment: (e) => vt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => vt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, s, n, o, i) {
    const l = s ? s.previousSibling : t.lastChild;
    if (o && (o === i || o.nextSibling))
      for (; t.insertBefore(o.cloneNode(!0), s), !(o === i || !(o = o.nextSibling)); )
        ;
    else {
      wo.innerHTML = Qi(
        n === "svg" ? `<svg>${e}</svg>` : n === "mathml" ? `<math>${e}</math>` : e
      );
      const r = wo.content;
      if (n === "svg" || n === "mathml") {
        const a = r.firstChild;
        for (; a.firstChild; )
          r.appendChild(a.firstChild);
        r.removeChild(a);
      }
      t.insertBefore(r, s);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      s ? s.previousSibling : t.lastChild
    ];
  }
}, kt = "transition", ss = "animation", xs = /* @__PURE__ */ Symbol("_vtc"), er = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, ua = /* @__PURE__ */ xe(
  {},
  wi,
  er
), fa = (e) => (e.displayName = "Transition", e.props = ua, e), tr = /* @__PURE__ */ fa(
  (e, { slots: t }) => ia(ll, da(e), t)
), Ft = (e, t = []) => {
  z(e) ? e.forEach((s) => s(...t)) : e && e(...t);
}, Co = (e) => e ? z(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function da(e) {
  const t = {};
  for (const R in e)
    R in er || (t[R] = e[R]);
  if (e.css === !1)
    return t;
  const {
    name: s = "v",
    type: n,
    duration: o,
    enterFromClass: i = `${s}-enter-from`,
    enterActiveClass: l = `${s}-enter-active`,
    enterToClass: r = `${s}-enter-to`,
    appearFromClass: a = i,
    appearActiveClass: d = l,
    appearToClass: u = r,
    leaveFromClass: p = `${s}-leave-from`,
    leaveActiveClass: g = `${s}-leave-active`,
    leaveToClass: b = `${s}-leave-to`
  } = e, M = pa(o), E = M && M[0], I = M && M[1], {
    onBeforeEnter: v,
    onEnter: m,
    onEnterCancelled: _,
    onLeave: S,
    onLeaveCancelled: K,
    onBeforeAppear: j = v,
    onAppear: q = m,
    onAppearCancelled: N = _
  } = t, Q = (R, re, $e, Z) => {
    R._enterCancelled = Z, Ut(R, re ? u : r), Ut(R, re ? d : l), $e && $e();
  }, ie = (R, re) => {
    R._isLeaving = !1, Ut(R, p), Ut(R, b), Ut(R, g), re && re();
  }, ae = (R) => (re, $e) => {
    const Z = R ? q : m, X = () => Q(re, R, $e);
    Ft(Z, [re, X]), xo(() => {
      Ut(re, R ? a : i), gt(re, R ? u : r), Co(Z) || $o(re, n, E, X);
    });
  };
  return xe(t, {
    onBeforeEnter(R) {
      Ft(v, [R]), gt(R, i), gt(R, l);
    },
    onBeforeAppear(R) {
      Ft(j, [R]), gt(R, a), gt(R, d);
    },
    onEnter: ae(!1),
    onAppear: ae(!0),
    onLeave(R, re) {
      R._isLeaving = !0;
      const $e = () => ie(R, re);
      gt(R, p), R._enterCancelled ? (gt(R, g), To(R)) : (To(R), gt(R, g)), xo(() => {
        R._isLeaving && (Ut(R, p), gt(R, b), Co(S) || $o(R, n, I, $e));
      }), Ft(S, [R, $e]);
    },
    onEnterCancelled(R) {
      Q(R, !1, void 0, !0), Ft(_, [R]);
    },
    onAppearCancelled(R) {
      Q(R, !0, void 0, !0), Ft(N, [R]);
    },
    onLeaveCancelled(R) {
      ie(R), Ft(K, [R]);
    }
  });
}
function pa(e) {
  if (e == null)
    return null;
  if (de(e))
    return [_n(e.enter), _n(e.leave)];
  {
    const t = _n(e);
    return [t, t];
  }
}
function _n(e) {
  return hr(e);
}
function gt(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.add(s)), (e[xs] || (e[xs] = /* @__PURE__ */ new Set())).add(t);
}
function Ut(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.remove(n));
  const s = e[xs];
  s && (s.delete(t), s.size || (e[xs] = void 0));
}
function xo(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let ha = 0;
function $o(e, t, s, n) {
  const o = e._endId = ++ha, i = () => {
    o === e._endId && n();
  };
  if (s != null)
    return setTimeout(i, s);
  const { type: l, timeout: r, propCount: a } = ga(e, t);
  if (!l)
    return n();
  const d = l + "end";
  let u = 0;
  const p = () => {
    e.removeEventListener(d, g), i();
  }, g = (b) => {
    b.target === e && ++u >= a && p();
  };
  setTimeout(() => {
    u < a && p();
  }, r + 1), e.addEventListener(d, g);
}
function ga(e, t) {
  const s = window.getComputedStyle(e), n = (M) => (s[M] || "").split(", "), o = n(`${kt}Delay`), i = n(`${kt}Duration`), l = ko(o, i), r = n(`${ss}Delay`), a = n(`${ss}Duration`), d = ko(r, a);
  let u = null, p = 0, g = 0;
  t === kt ? l > 0 && (u = kt, p = l, g = i.length) : t === ss ? d > 0 && (u = ss, p = d, g = a.length) : (p = Math.max(l, d), u = p > 0 ? l > d ? kt : ss : null, g = u ? u === kt ? i.length : a.length : 0);
  const b = u === kt && /\b(?:transform|all)(?:,|$)/.test(
    n(`${kt}Property`).toString()
  );
  return {
    type: u,
    timeout: p,
    propCount: g,
    hasTransform: b
  };
}
function ko(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((s, n) => So(s) + So(e[n])));
}
function So(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function To(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function va(e, t, s) {
  const n = e[xs];
  n && (t = (t ? [t, ...n] : [...n]).join(" ")), t == null ? e.removeAttribute("class") : s ? e.setAttribute("class", t) : e.className = t;
}
const Ao = /* @__PURE__ */ Symbol("_vod"), ma = /* @__PURE__ */ Symbol("_vsh"), ya = /* @__PURE__ */ Symbol(""), ba = /(?:^|;)\s*display\s*:/;
function _a(e, t, s) {
  const n = e.style, o = _e(s);
  let i = !1;
  if (s && !o) {
    if (t)
      if (_e(t))
        for (const l of t.split(";")) {
          const r = l.slice(0, l.indexOf(":")).trim();
          s[r] == null && os(n, r, "");
        }
      else
        for (const l in t)
          s[l] == null && os(n, l, "");
    for (const l in s) {
      l === "display" && (i = !0);
      const r = s[l];
      r != null ? Ca(
        e,
        l,
        !_e(t) && t ? t[l] : void 0,
        r
      ) || os(n, l, r) : os(n, l, "");
    }
  } else if (o) {
    if (t !== s) {
      const l = n[ya];
      l && (s += ";" + l), n.cssText = s, i = ba.test(s);
    }
  } else t && e.removeAttribute("style");
  Ao in e && ((!o || t !== s) && (e[Ao] = i ? n.display : ""), e[ma] && (n.display = "none"));
}
const Os = /\s*!important$/;
function os(e, t, s) {
  if (z(s))
    s.forEach((n) => os(e, t, n));
  else if (s == null && (s = ""), t.startsWith("--"))
    Os.test(s) ? e.setProperty(t, s.replace(Os, ""), "important") : e.setProperty(t, s);
  else {
    const n = wa(e, t);
    Os.test(s) ? e.setProperty(
      Gt(n),
      s.replace(Os, ""),
      "important"
    ) : e[n] = s;
  }
}
const Eo = ["Webkit", "Moz", "ms"], wn = {};
function wa(e, t) {
  const s = wn[t];
  if (s)
    return s;
  let n = Ze(t);
  if (n !== "filter" && n in e)
    return wn[t] = n;
  n = qo(n);
  for (let o = 0; o < Eo.length; o++) {
    const i = Eo[o] + n;
    if (i in e)
      return wn[t] = i;
  }
  return t;
}
function Ca(e, t, s, n) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && _e(n) && s === n;
}
const Po = "http://www.w3.org/1999/xlink";
function Io(e, t, s, n, o, i = _r(t)) {
  n && t.startsWith("xlink:") ? s == null ? e.removeAttributeNS(Po, t.slice(6, t.length)) : e.setAttributeNS(Po, t, s) : s == null || i && !Wo(s) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : ct(s) ? String(s) : s
  );
}
function Lo(e, t, s, n, o) {
  if (t === "innerHTML" || t === "textContent") {
    s != null && (e[t] = t === "innerHTML" ? Qi(s) : s);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const r = i === "OPTION" ? e.getAttribute("value") || "" : e.value, a = s == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(s);
    (r !== a || !("_value" in e)) && (e.value = a), s == null && e.removeAttribute(t), e._value = s;
    return;
  }
  let l = !1;
  if (s === "" || s == null) {
    const r = typeof e[t];
    r === "boolean" ? s = Wo(s) : s == null && r === "string" ? (s = "", l = !0) : r === "number" && (s = 0, l = !0);
  }
  try {
    e[t] = s;
  } catch {
  }
  l && e.removeAttribute(o || t);
}
function At(e, t, s, n) {
  e.addEventListener(t, s, n);
}
function xa(e, t, s, n) {
  e.removeEventListener(t, s, n);
}
const Oo = /* @__PURE__ */ Symbol("_vei");
function $a(e, t, s, n, o = null) {
  const i = e[Oo] || (e[Oo] = {}), l = i[t];
  if (n && l)
    l.value = n;
  else {
    const [r, a] = Ta(t);
    if (n) {
      const d = i[t] = Pa(
        n,
        o
      );
      At(e, r, d, a);
    } else l && (xa(e, r, l, a), i[t] = void 0);
  }
}
const ka = /(Once|Passive|Capture)$/, Sa = /^on:?(?:Once|Passive|Capture)$/;
function Ta(e) {
  let t, s;
  for (; (s = e.match(ka)) && !Sa.test(e); )
    t || (t = {}), e = e.slice(0, e.length - s[1].length), t[s[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : Gt(e.slice(2)), t];
}
let Cn = 0;
const Aa = /* @__PURE__ */ Promise.resolve(), Ea = () => Cn || (Aa.then(() => Cn = 0), Cn = Date.now());
function Pa(e, t) {
  const s = (n) => {
    if (!n._vts)
      n._vts = Date.now();
    else if (n._vts <= s.attached)
      return;
    const o = s.value;
    if (z(o)) {
      const i = n.stopImmediatePropagation;
      n.stopImmediatePropagation = () => {
        i.call(n), n._stopped = !0;
      };
      const l = o.slice(), r = [n];
      for (let a = 0; a < l.length && !n._stopped; a++) {
        const d = l[a];
        d && Je(
          d,
          t,
          5,
          r
        );
      }
    } else
      Je(
        o,
        t,
        5,
        [n]
      );
  };
  return s.value = e, s.attached = Ea(), s;
}
const No = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ia = (e, t, s, n, o, i) => {
  const l = o === "svg";
  t === "class" ? va(e, n, l) : t === "style" ? _a(e, s, n) : Js(t) ? Ys(t) || $a(e, t, s, n, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : La(e, t, n, l)) ? (Lo(e, t, n), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Io(e, t, n, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Oa(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !_e(n))) ? Lo(e, Ze(t), n, i, t) : (t === "true-value" ? e._trueValue = n : t === "false-value" && (e._falseValue = n), Io(e, t, n, l));
};
function La(e, t, s, n) {
  if (n)
    return !!(t === "innerHTML" || t === "textContent" || t in e && No(t) && ne(s));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return No(t) && _e(s) ? !1 : t in e;
}
function Oa(e, t) {
  const s = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!s)
    return !1;
  const n = Ze(t);
  return Array.isArray(s) ? s.some((o) => Ze(o) === n) : Object.keys(s).some((o) => Ze(o) === n);
}
const Qt = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return z(t) ? (s) => Rs(t, s) : t;
};
function Na(e) {
  e.target.composing = !0;
}
function Mo(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const lt = /* @__PURE__ */ Symbol("_assign"), Ns = /* @__PURE__ */ Symbol("_initialValue");
function xn(e, t, s) {
  return t && (e = e.trim()), s && (e = Ss(e)), e;
}
const Ce = {
  created(e, { modifiers: { lazy: t, trim: s, number: n } }, o) {
    e.parentNode && (e.type === "text" ? e[Ns] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Ns] = e.defaultValue.replace(/\r\n?/g, `
`))), e[lt] = Qt(o);
    const i = n || o.props && o.props.type === "number";
    At(e, t ? "change" : "input", (l) => {
      l.target.composing || e[lt](xn(e.value, s, i));
    }), (s || i) && At(e, "change", () => {
      e.value = xn(e.value, s, i);
    }), t || (At(e, "compositionstart", Na), At(e, "compositionend", Mo), At(e, "change", Mo));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: s, number: n } }) {
    const o = t ?? "", i = e[Ns];
    delete e[Ns], i !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== i ? e[lt](xn(e.value, s, n)) : e.value = o;
  },
  beforeUpdate(e, { value: t, oldValue: s, modifiers: { lazy: n, trim: o, number: i } }, l) {
    if (e[lt] = Qt(l), e.composing) return;
    const r = (i || e.type === "number") && !/^0\d/.test(e.value) ? Ss(e.value) : e.value, a = t ?? "";
    if (r === a)
      return;
    const d = e.getRootNode();
    (d instanceof Document || d instanceof ShadowRoot) && d.activeElement === e && e.type !== "range" && (n && t === s || o && e.value.trim() === a) || (e.value = a);
  }
}, sr = {
  // #4096 array checkboxes need to be deep traversed
  deep: !0,
  created(e, t, s) {
    e[lt] = Qt(s), At(e, "change", () => {
      const n = e._modelValue, o = $s(e), i = e.checked, l = e[lt];
      if (z(n)) {
        const r = Fn(n, o), a = r !== -1;
        if (i && !a)
          l(n.concat(o));
        else if (!i && a) {
          const d = [...n];
          d.splice(r, 1), l(d);
        }
      } else if (wt(n)) {
        const r = new Set(n);
        i ? r.add(o) : r.delete(o), l(r);
      } else
        l(nr(e, i));
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: Ro,
  beforeUpdate(e, t, s) {
    e[lt] = Qt(s), Ro(e, t, s);
  }
};
function Ro(e, { value: t, oldValue: s }, n) {
  e._modelValue = t;
  let o;
  if (z(t))
    o = Fn(t, n.props.value) > -1;
  else if (wt(t))
    o = t.has(n.props.value);
  else {
    if (t === s) return;
    o = Ct(t, nr(e, !0));
  }
  e.checked !== o && (e.checked = o);
}
const an = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: s } }, n) {
    e._modelValue = t, At(e, "change", () => {
      const o = Array.prototype.filter.call(e.options, (a) => a.selected).map(
        (a) => s ? Ss($s(a)) : $s(a)
      ), i = e.multiple, l = i ? wt(e._modelValue) ? new Set(o) : o : o[0], r = e._pendingValue = [
        i,
        i ? z(l) ? o.slice() : o : l
      ];
      try {
        e[lt](l);
      } finally {
        pi(() => {
          e._pendingValue === r && (e._pendingValue = void 0);
        });
      }
    }), e[lt] = Qt(n);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t, modifiers: { number: s } }) {
    Do(e, t, s);
  },
  beforeUpdate(e, { value: t }, s) {
    e._modelValue = t, e[lt] = Qt(s);
  },
  updated(e, { value: t, modifiers: { number: s } }) {
    const n = e._pendingValue;
    e._pendingValue = void 0, (!n || n[0] !== e.multiple || !Ma(t, n[1], n[0])) && Do(e, t, s);
  }
};
function Ma(e, t, s) {
  if (!s || z(e)) return Ct(e, t);
  if (wt(e)) {
    if (e.size !== t.length) return !1;
    for (const n of t)
      if (!e.has(n)) return !1;
    return !0;
  }
  return !1;
}
function Do(e, t, s = !1) {
  const n = e.multiple, o = z(t);
  if (!(n && !o && !wt(t))) {
    for (let i = 0, l = e.options.length; i < l; i++) {
      const r = e.options[i], a = $s(r);
      if (n)
        if (o) {
          const d = typeof a;
          d === "string" || d === "number" ? r.selected = t.some((u) => String(u) === String(a)) : r.selected = Fn(t, a) > -1;
        } else
          r.selected = t.has(a) || s && typeof a == "string" && t.has(Ss(a));
      else if (Ct($s(r), t)) {
        e.selectedIndex !== i && (e.selectedIndex = i);
        return;
      }
    }
    !n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function $s(e) {
  return "_value" in e ? e._value : e.value;
}
function nr(e, t) {
  const s = t ? "_trueValue" : "_falseValue";
  return s in e ? e[s] : t;
}
const Ra = ["ctrl", "shift", "alt", "meta"], Da = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => Ra.some((s) => e[`${s}Key`] && !t.includes(s))
}, De = (e, t) => {
  if (!e) return e;
  const s = e._withMods || (e._withMods = {}), n = t.join(".");
  return s[n] || (s[n] = (o, ...i) => {
    for (let l = 0; l < t.length; l++) {
      const r = Da[t[l]];
      if (r && r(o, t)) return;
    }
    return e(o, ...i);
  });
}, Fa = /* @__PURE__ */ xe({ patchProp: Ia }, ca);
let Fo;
function Ua() {
  return Fo || (Fo = Vl(Fa));
}
const ja = (...e) => {
  const t = Ua().createApp(...e), { mount: s } = t;
  return t.mount = (n) => {
    const o = Ba(n);
    if (!o) return;
    const i = t._component;
    !ne(i) && !i.render && !i.template && (i.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const l = s(o, !1, Va(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), l;
  }, t;
};
function Va(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Ba(e) {
  return _e(e) ? document.querySelector(e) : e;
}
const Se = "/libretto/api/v1";
async function Ha() {
  const e = await fetch(`${Se}/health`);
  if (!e.ok) throw new Error(`Health check failed: ${e.statusText}`);
  return await e.json();
}
async function Ka(e) {
  const t = new URLSearchParams();
  e.q && t.set("q", e.q), e.tag && t.set("tag", e.tag), e.sort && t.set("sort", e.sort), t.set("limit", String(e.limit)), e.cursor && t.set("cursor", String(e.cursor));
  const s = await fetch(`${Se}/entries?${t.toString()}`);
  if (!s.ok) throw new Error(`Failed to list entries: ${s.statusText}`);
  return await s.json();
}
async function or(e) {
  const t = await fetch(`${Se}/entries/${encodeURIComponent(e)}`);
  if (!t.ok) throw new Error(`Failed to fetch entry ${e}: ${t.statusText}`);
  return await t.json();
}
async function qa(e) {
  var s;
  const t = await fetch(`${Se}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!t.ok) {
    const n = await t.json().catch(() => ({}));
    throw new Error(((s = n.error) == null ? void 0 : s.message) || `Failed to create entry: ${t.statusText}`);
  }
  return await t.json();
}
async function Ga(e, t) {
  var o;
  const s = {};
  t && (s["If-Match"] = t);
  const n = await fetch(`${Se}/entries/${encodeURIComponent(e)}`, {
    method: "DELETE",
    headers: s
  });
  if (!n.ok) {
    const i = await n.json().catch(() => ({}));
    throw new Error(((o = i.error) == null ? void 0 : o.message) || `Failed to delete entry: ${n.statusText}`);
  }
}
async function Uo(e, t = !1, s = "rename") {
  var o;
  const n = await fetch(`${Se}/import?dry_run=${t}&conflict=${s}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!n.ok) {
    const i = await n.json().catch(() => ({}));
    throw new Error(((o = i.error) == null ? void 0 : o.message) || `Import failed: ${n.statusText}`);
  }
  return await n.json();
}
function Wa() {
  return `${Se}/export_all`;
}
async function za(e, t) {
  var n;
  const s = await fetch(`${Se}/entries/${encodeURIComponent(e)}/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_base64: t })
  });
  if (!s.ok) {
    const o = await s.json().catch(() => ({}));
    throw new Error(((n = o.error) == null ? void 0 : n.message) || `Failed to upload preview: ${s.statusText}`);
  }
  return await s.json();
}
function Ja(e) {
  return `${Se}/export/${encodeURIComponent(e)}`;
}
function Ya(e) {
  if (!e) return "";
  const t = e.replace(/^assets\//, "");
  return `${Se}/assets/${encodeURIComponent(t)}`;
}
async function Xa() {
  return (await Ha()).storage;
}
async function Za() {
  const e = await fetch(`${Se}/profiles`);
  if (!e.ok) throw new Error(`Failed to fetch profiles: ${e.statusText}`);
  return (await e.json()).profiles;
}
async function Qa() {
  const e = await fetch(`${Se}/categories`);
  if (!e.ok) throw new Error(`Failed to fetch categories: ${e.statusText}`);
  return (await e.json()).categories;
}
async function ec(e) {
  var s;
  const t = await fetch(`${Se}/compile_preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!t.ok) {
    const n = await t.json().catch(() => ({}));
    throw new Error(((s = n.error) == null ? void 0 : s.message) || `Failed to compile prompt: ${t.statusText}`);
  }
  return await t.json();
}
async function tc(e) {
  const t = new URLSearchParams();
  e.category && t.set("category", e.category), e.q && t.set("q", e.q), t.set("limit", String(e.limit)), e.offset && t.set("offset", String(e.offset)), e.source && t.set("source", e.source);
  const s = await fetch(`${Se}/presets?${t.toString()}`);
  if (!s.ok) throw new Error(`Failed to list library presets: ${s.statusText}`);
  return await s.json();
}
async function ir(e) {
  var s;
  const t = await fetch(`${Se}/presets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!t.ok) {
    const n = await t.json().catch(() => ({}));
    throw new Error(((s = n.error) == null ? void 0 : s.message) || `Failed to save preset: ${t.statusText}`);
  }
  return await t.json();
}
async function sc(e, t) {
  var n;
  const s = await fetch(`${Se}/presets/${encodeURIComponent(e)}/${encodeURIComponent(t)}`, {
    method: "DELETE"
  });
  if (!s.ok) {
    const o = await s.json().catch(() => ({}));
    throw new Error(((n = o.error) == null ? void 0 : n.message) || `Failed to delete preset: ${s.statusText}`);
  }
}
function nc(e, t = !1) {
  const s = new URLSearchParams();
  return e && s.set("category", e), t && s.set("include_bundled", "true"), `${Se}/presets/export_pack?${s.toString()}`;
}
async function oc(e) {
  var s;
  const t = await fetch(`${Se}/presets/import_pack`, {
    method: "POST",
    headers: { "Content-Type": "application/zip" },
    body: e
  });
  if (!t.ok) {
    const n = await t.json().catch(() => ({}));
    throw new Error(((s = n.error) == null ? void 0 : s.message) || `Failed to import presets pack: ${t.statusText}`);
  }
  return await t.json();
}
function ic(e, t) {
  return e ? `${Se}/presets/thumb/${encodeURIComponent(e)}/${encodeURIComponent(t)}` : `${Se}/presets/thumb/${encodeURIComponent(t)}`;
}
const rc = { class: "libretto-library" }, lc = { class: "libretto-toolbar" }, ac = { class: "search-input-wrapper" }, cc = { class: "filter-row" }, uc = {
  key: 0,
  class: "tag-filter-pill"
}, fc = {
  key: 1,
  class: "libretto-state-box"
}, dc = {
  key: 2,
  class: "libretto-state-box error"
}, pc = {
  key: 3,
  class: "libretto-state-box empty"
}, hc = { key: 0 }, gc = { key: 1 }, vc = {
  key: 4,
  class: "entries-list"
}, mc = ["onClick"], yc = { class: "entry-header" }, bc = { class: "entry-title-wrap" }, _c = { class: "entry-title" }, wc = { class: "version-tag" }, Cc = { class: "date-text" }, xc = { class: "entry-meta" }, $c = { class: "tags-container" }, kc = ["onClick"], Sc = { class: "req-indicator" }, Tc = ["onClick"], Ac = ["onClick"], Ec = /* @__PURE__ */ Ot({
  __name: "LibraryView",
  emits: ["select-entry", "quick-apply", "open-save"],
  setup(e, { expose: t, emit: s }) {
    const n = /* @__PURE__ */ B([]), o = /* @__PURE__ */ B(0), i = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(""), d = /* @__PURE__ */ B("updated_at");
    let u = null;
    async function p() {
      i.value = !0, l.value = null;
      try {
        const I = await Ka({
          q: r.value,
          tag: a.value,
          sort: d.value,
          limit: 100
        });
        n.value = I.items, o.value = I.total;
      } catch (I) {
        l.value = I.message || "Failed to load library";
      } finally {
        i.value = !1;
      }
    }
    function g() {
      clearTimeout(u), u = setTimeout(() => {
        p();
      }, 250);
    }
    function b() {
      r.value = "", p();
    }
    function M(I) {
      a.value = I, p();
    }
    function E(I) {
      if (!I) return "";
      try {
        return new Date(I).toLocaleDateString(void 0, { month: "short", day: "numeric" });
      } catch {
        return "";
      }
    }
    return Nt(() => {
      p();
    }), t({ refresh: p }), (I, v) => (x(), A("div", rc, [
      c("div", lc, [
        c("div", ac, [
          me(c("input", {
            "onUpdate:modelValue": v[0] || (v[0] = (m) => r.value = m),
            type: "text",
            placeholder: "Search compositions, tags...",
            class: "libretto-input",
            onInput: g
          }, null, 544), [
            [Ce, r.value]
          ]),
          r.value ? (x(), A("button", {
            key: 0,
            class: "clear-btn",
            onClick: b
          }, "×")) : oe("", !0)
        ]),
        c("div", cc, [
          me(c("select", {
            "onUpdate:modelValue": v[1] || (v[1] = (m) => d.value = m),
            class: "libretto-select",
            onChange: p
          }, [...v[6] || (v[6] = [
            c("option", { value: "updated_at" }, "Recently Updated", -1),
            c("option", { value: "title" }, "Alphabetical (A-Z)", -1),
            c("option", { value: "title_desc" }, "Alphabetical (Z-A)", -1)
          ])], 544), [
            [an, d.value]
          ]),
          c("button", {
            class: "libretto-btn primary",
            onClick: v[2] || (v[2] = (m) => I.$emit("open-save"))
          }, " + Save Active Graph ")
        ])
      ]),
      a.value ? (x(), A("div", uc, [
        c("span", null, [
          v[7] || (v[7] = Be("Tag: ", -1)),
          c("strong", null, H(a.value), 1)
        ]),
        c("button", {
          onClick: v[3] || (v[3] = (m) => M(""))
        }, "×")
      ])) : oe("", !0),
      i.value ? (x(), A("div", fc, [...v[8] || (v[8] = [
        c("span", { class: "spinner" }, null, -1),
        Be(" Loading library... ", -1)
      ])])) : l.value ? (x(), A("div", dc, [
        c("p", null, H(l.value), 1),
        c("button", {
          class: "libretto-btn",
          onClick: p
        }, "Retry")
      ])) : n.value.length === 0 ? (x(), A("div", pc, [
        r.value || a.value ? (x(), A("p", hc, "No compositions match your search.")) : (x(), A("div", gc, [
          v[9] || (v[9] = c("p", null, "No saved compositions found in your Libretto library.", -1)),
          c("button", {
            class: "libretto-btn primary",
            onClick: v[4] || (v[4] = (m) => I.$emit("open-save"))
          }, " Save Current Graph as Libretto ")
        ]))
      ])) : (x(), A("div", vc, [
        (x(!0), A(ye, null, je(n.value, (m) => (x(), A("div", {
          key: m.id,
          class: "entry-card",
          onClick: (_) => I.$emit("select-entry", m.id)
        }, [
          c("div", yc, [
            c("div", bc, [
              c("h4", _c, H(m.title), 1),
              c("span", wc, "v" + H(m.version), 1)
            ]),
            c("span", Cc, H(E(m.updated_at)), 1)
          ]),
          c("div", xc, [
            c("div", $c, [
              (x(!0), A(ye, null, je(m.tags, (_) => (x(), A("span", {
                key: _,
                class: "tag-chip",
                onClick: De((S) => M(_), ["stop"])
              }, " #" + H(_), 9, kc))), 128))
            ]),
            c("div", Sc, H(m.requirements_count) + " required node types ", 1)
          ]),
          c("div", {
            class: "card-actions",
            onClick: v[5] || (v[5] = De(() => {
            }, ["stop"]))
          }, [
            c("button", {
              class: "libretto-btn btn-sm",
              title: "Inspect metadata, dependencies, and interfaces",
              onClick: (_) => I.$emit("select-entry", m.id)
            }, " Inspect ", 8, Tc),
            c("button", {
              class: "libretto-btn btn-sm primary",
              title: "Insert composition into active graph",
              onClick: (_) => I.$emit("quick-apply", m.id)
            }, " Apply ", 8, Ac)
          ])
        ], 8, mc))), 128))
      ]))
    ]));
  }
}), Wt = (e, t) => {
  const s = e.__vccOpts || e;
  for (const [n, o] of t)
    s[n] = o;
  return s;
}, Pc = /* @__PURE__ */ Wt(Ec, [["__scopeId", "data-v-8f4d6717"]]);
let Zt = null;
function Yn() {
  try {
    Zt = rr();
  } catch {
    Zt = null;
  }
}
function Ic() {
  if (!Zt) return !1;
  const e = Mt();
  return !e || !e.graph ? !1 : (e.loadGraphData(Zt), Zt = null, !0);
}
function Ms() {
  return Zt !== null;
}
function Mt() {
  var e, t;
  if (typeof window < "u") {
    if ((t = (e = window.comfyAPI) == null ? void 0 : e.app) != null && t.app)
      return window.comfyAPI.app.app;
    if (window.app)
      return window.app;
  }
  return null;
}
function Lc() {
  const e = Mt();
  if (!e || !e.graph || !e.canvas)
    return null;
  const t = e.canvas.selected_nodes;
  if (!t || Object.keys(t).length === 0)
    return null;
  const s = Object.values(t), n = new Set(s.map((r) => r.id)), o = s.map((r) => r.serialize ? r.serialize() : { id: r.id, type: r.type, pos: r.pos }), i = e.graph.links, l = [];
  if (i) {
    const r = Array.isArray(i) ? i : Object.values(i);
    for (const a of r) {
      if (!a) continue;
      const d = a.origin_id !== void 0 ? a.origin_id : a[1], u = a.target_id !== void 0 ? a.target_id : a[3];
      n.has(d) && n.has(u) && l.push(Array.isArray(a) ? a : [
        a.id,
        a.origin_id,
        a.origin_slot,
        a.target_id,
        a.target_slot,
        a.type
      ]);
    }
  }
  return {
    nodes: o,
    links: l
  };
}
function Oc() {
  var t;
  const e = Mt();
  if (!e || !((t = e.canvas) != null && t.canvas)) return null;
  try {
    return e.canvas.canvas.toDataURL("image/webp", 0.7);
  } catch {
    return null;
  }
}
function rr() {
  const e = Mt();
  if (!e || !e.graph)
    throw new Error("ComfyUI graph is not available.");
  return e.graph.serialize();
}
function Nc(e) {
  const t = [], s = [], n = typeof LiteGraph < "u" ? LiteGraph.registered_node_types : null;
  for (const o of e)
    n && (n[o] || n[o.replace(/ /g, "")]) ? s.push(o) : t.push(o);
  return { missing: t, installed: s };
}
function lr(e, t = "smart_apply", s) {
  var I, v, m, _, S, K;
  const n = Mt();
  if (!n || !n.graph)
    throw new Error("ComfyUI graph is not available.");
  Yn();
  const o = JSON.parse(JSON.stringify(e));
  if (s && Array.isArray(o.nodes)) {
    for (const j of o.nodes)
      if (j.type === "LibrettoInput" && Array.isArray(j.widgets_values)) {
        const q = j.widgets_values[0];
        if (q && s[q] !== void 0) {
          const N = s[q], Q = String(j.widgets_values[1] || "STRING").toUpperCase();
          Q === "INT" ? j.widgets_values[3] = parseInt(String(N), 10) || 0 : Q === "FLOAT" ? j.widgets_values[4] = parseFloat(String(N)) || 0 : Q === "BOOLEAN" ? j.widgets_values[5] = !!N : j.widgets_values[2] = String(N);
        }
      }
  }
  if (t === "replace")
    return n.loadGraphData(o), { adjustedCount: 0, addedCount: ((I = o.nodes) == null ? void 0 : I.length) || 0 };
  const i = n.graph;
  if (!o || !Array.isArray(o.nodes))
    return n.loadGraphData(o), { adjustedCount: 0, addedCount: 0 };
  const l = i._nodes || [];
  let r = 0;
  for (const j of l)
    j.id > r && (r = j.id);
  for (const j of o.nodes)
    j.id > r && (r = j.id);
  let a = 1 / 0, d = 1 / 0;
  for (const j of o.nodes)
    j.pos && (j.pos[0] < a && (a = j.pos[0]), j.pos[1] < d && (d = j.pos[1]));
  let u = 100, p = 100;
  if ((v = n.canvas) != null && v.visible_area && n.canvas.visible_area.length >= 4)
    u = n.canvas.visible_area[0] + 50, p = n.canvas.visible_area[1] + 50;
  else if ((_ = (m = n.canvas) == null ? void 0 : m.ds) != null && _.offset && ((K = (S = n.canvas) == null ? void 0 : S.ds) != null && K.scale)) {
    const j = n.canvas.ds.scale || 1;
    u = -n.canvas.ds.offset[0] / j + 50, p = -n.canvas.ds.offset[1] / j + 50;
  }
  const g = u - (a === 1 / 0 ? 0 : a), b = p - (d === 1 / 0 ? 0 : d), M = r + 10, E = /* @__PURE__ */ new Map();
  for (const j of o.nodes) {
    const q = j.id, N = q + M;
    E.set(q, N), j.id = N, j.pos && (j.pos[0] += g, j.pos[1] += b);
  }
  if (Array.isArray(o.links))
    for (const j of o.links)
      Array.isArray(j) && j.length >= 5 && (E.has(j[1]) && (j[1] = E.get(j[1])), E.has(j[3]) && (j[3] = E.get(j[3])), j[0] += M * 10);
  return Mc(o, [0, 0]), { adjustedCount: 0, addedCount: o.nodes.length };
}
function Mc(e, t = [100, 100]) {
  const s = Mt();
  if (!s || !s.graph)
    throw new Error("ComfyUI canvas not ready.");
  Yn();
  const n = s.graph, o = e.nodes || [], i = e.links || [], l = /* @__PURE__ */ new Map(), r = [], a = ar();
  if (!a) throw new Error("LiteGraph not found");
  for (const d of o) {
    const u = a.createNode(d.type);
    u && (d.pos && (u.pos = [d.pos[0] + t[0], d.pos[1] + t[1]]), d.size && (u.size = [...d.size]), d.widgets_values && u.widgets && d.widgets_values.forEach((p, g) => {
      u.widgets[g] && (u.widgets[g].value = p);
    }), n.add(u), l.set(d.id, u.id), r.push(u));
  }
  for (const d of i) {
    const u = l.get(d[1]), p = l.get(d[3]), g = d[2], b = d[4];
    if (u !== void 0 && p !== void 0) {
      const M = n.getNodeById(u), E = n.getNodeById(p);
      M && E && M.connect(g, E, b);
    }
  }
  s.canvas && r.length > 0 && s.canvas.selectNodes(r), n.setDirtyCanvas(!0, !0);
}
function ar() {
  var t;
  if (typeof LiteGraph < "u")
    return LiteGraph;
  const e = Mt();
  return (t = e == null ? void 0 : e.graph) != null && t.constructor && window.LiteGraph || null;
}
function Rc(e, t, s, n) {
  var I, v, m, _, S, K, j, q, N, Q, ie, ae, R, re, $e;
  const o = Mt();
  if (!o || !o.graph)
    return { success: !1, mode: "error", message: "ComfyUI canvas not found. Make sure ComfyUI is loaded." };
  const i = ar();
  if (!i)
    return { success: !1, mode: "error", message: "LiteGraph engine not accessible on page." };
  Yn();
  const l = o.graph, r = o.canvas, a = r != null && r.selected_nodes ? Object.values(r.selected_nodes) : [];
  if (a.length > 0) {
    const Z = a.filter(
      (X) => X.type === "CLIPTextEncode" || X.widgets && X.widgets.some((Y) => Y.name === "text")
    );
    if (Z.length === 1) {
      const X = ((I = Z[0].widgets) == null ? void 0 : I.find((Y) => Y.name === "text")) || ((v = Z[0].widgets) == null ? void 0 : v[0]);
      if (X)
        return X.value = s, l.setDirtyCanvas(!0, !0), {
          success: !0,
          mode: "updated_existing",
          message: `✓ Updated selected node #${Z[0].id} with positive prompt!`
        };
    } else if (Z.length >= 2) {
      const X = ((m = Z[0].widgets) == null ? void 0 : m.find((w) => w.name === "text")) || ((_ = Z[0].widgets) == null ? void 0 : _[0]), Y = ((S = Z[1].widgets) == null ? void 0 : S.find((w) => w.name === "text")) || ((K = Z[1].widgets) == null ? void 0 : K[0]);
      return X && (X.value = s), Y && (Y.value = n), l.setDirtyCanvas(!0, !0), {
        success: !0,
        mode: "updated_existing",
        message: "✓ Updated selected positive & negative prompt nodes!"
      };
    }
  }
  const u = (l._nodes || []).filter(
    (Z) => Z.type === "CLIPTextEncode" && Z.widgets && Z.widgets.length > 0
  );
  if (u.length >= 1) {
    let Z = null, X = null;
    for (const w of u) {
      const O = (w.title || "").toLowerCase();
      O.includes("pos") || O.includes("libretto positive") ? Z = w : (O.includes("neg") || O.includes("libretto negative")) && (X = w);
    }
    if (!Z || !X) {
      for (const w of u)
        if (!(!w.outputs || !w.outputs[0] || !w.outputs[0].links))
          for (const O of w.outputs[0].links) {
            const te = l.links ? (Array.isArray(l.links), l.links[O]) : null;
            if (!te) continue;
            const ce = te.target_id !== void 0 ? te.target_id : te[3], he = te.target_slot !== void 0 ? te.target_slot : te[4], Te = l.getNodeById(ce);
            if (Te) {
              const se = ((N = (q = (j = Te.inputs) == null ? void 0 : j[he]) == null ? void 0 : q.name) == null ? void 0 : N.toLowerCase()) || "";
              se.includes("positive") || he === 1 ? Z = w : (se.includes("negative") || he === 2) && (X = w);
            }
          }
    }
    if (!Z && !X && u.length >= 2) {
      const w = [...u].sort((O, te) => O.pos[1] - te.pos[1]);
      Z = w[0], X = w[1];
    } else !Z && u.length === 1 && (Z = u[0]);
    let Y = 0;
    if (Z) {
      const w = ((Q = Z.widgets) == null ? void 0 : Q.find((O) => O.name === "text")) || Z.widgets[0];
      w && (w.value = s, Y++);
    }
    if (X && n) {
      const w = ((ie = X.widgets) == null ? void 0 : ie.find((O) => O.name === "text")) || X.widgets[0];
      w && (w.value = n, Y++);
    }
    if (Y > 0)
      return r != null && r.selectNodes && r.selectNodes([Z, X].filter(Boolean)), l.setDirtyCanvas(!0, !0), {
        success: !0,
        mode: "updated_existing",
        message: `✓ Updated ${Y} existing prompt node(s) on canvas!`
      };
  }
  let p = 300, g = 200;
  if (r != null && r.visible_area && r.visible_area.length >= 4)
    p = r.visible_area[0] + r.visible_area[2] / 2, g = r.visible_area[1] + r.visible_area[3] / 2;
  else if ((ae = r == null ? void 0 : r.ds) != null && ae.offset && ((R = r == null ? void 0 : r.ds) != null && R.scale)) {
    const Z = r.ds.scale || 1, X = ((re = r.canvas) == null ? void 0 : re.width) || 800, Y = (($e = r.canvas) == null ? void 0 : $e.height) || 600;
    p = -r.ds.offset[0] / Z + X / 2 / Z, g = -r.ds.offset[1] / Z + Y / 2 / Z;
  }
  if (!!(i.registered_node_types && i.registered_node_types.LibrettoPromptBuilder)) {
    let Z = "LibrettoSDXLProfile";
    e === "pony" ? Z = "LibrettoPonyProfile" : e === "flux" ? Z = "LibrettoFluxProfile" : e === "sd15" ? Z = "LibrettoSD15Profile" : e === "animagine" ? Z = "LibrettoAnimagineProfile" : e === "illustrious" ? Z = "LibrettoIllustriousProfile" : e === "photoreal" ? Z = "LibrettoPhotorealProfile" : e === "custom" && (Z = "LibrettoCustomProfile");
    const X = i.createNode(Z);
    X && (X.pos = [p - 340, g - 80], l.add(X));
    const Y = i.createNode("LibrettoPromptBuilder");
    return Y ? (Y.pos = [p + 20, g], l.add(Y), X && X.connect(0, Y, 0), t.slice(0, 6).forEach((w, O) => {
      let te = "LibrettoCustomPrompt";
      const ce = (w.category || "").toLowerCase();
      ce === "character" ? te = "LibrettoCharacter" : ce === "costume" ? te = "LibrettoOutfit" : ce === "hair" ? te = "LibrettoHair" : ce === "pose" ? te = "LibrettoPose" : ce === "emotion" || ce === "expression" ? te = "LibrettoExpression" : ce === "environment" || ce === "location" ? te = "LibrettoEnvironment" : ce === "lighting" ? te = "LibrettoLighting" : ce === "camera" || ce === "view" ? te = "LibrettoCamera" : ce === "style" && (te = "LibrettoStyle");
      const he = i.createNode(te);
      if (he) {
        if (he.pos = [p - 340, g + 80 + O * 110], he.widgets)
          for (const Te of he.widgets)
            Te.name === "name" ? Te.value = w.name || "" : Te.name === "keywords" ? Te.value = w.keywords || "" : Te.name === "description" ? Te.value = w.description || "" : Te.name === "weight" && (Te.value = w.weight || 1);
        l.add(he), he.connect(0, Y, 1 + O);
      }
    }), r != null && r.selectNode && r.selectNode(Y), l.setDirtyCanvas(!0, !0), {
      success: !0,
      mode: "libretto_nodes",
      message: "Libretto Prompt Builder & component nodes added to canvas!"
    }) : { success: !1, mode: "error", message: "Failed to instantiate LibrettoPromptBuilder node." };
  }
  const M = i.createNode("CLIPTextEncode");
  M && (M.pos = [p, g - 80], M.title = "Libretto Positive Prompt", M.widgets && M.widgets[0] && (M.widgets[0].value = s || "masterpiece, best quality"), l.add(M));
  const E = i.createNode("CLIPTextEncode");
  return E && (E.pos = [p, g + 120], E.title = "Libretto Negative Prompt", E.widgets && E.widgets[0] && (E.widgets[0].value = n || ""), l.add(E)), M && (r != null && r.selectNode) && r.selectNode(M), l.setDirtyCanvas(!0, !0), {
    success: !0,
    mode: "text_encode_nodes",
    message: "Placed Positive & Negative text nodes with compiled prompts on canvas!"
  };
}
const Dc = {
  key: 0,
  class: "libretto-state-box"
}, Fc = {
  key: 1,
  class: "libretto-state-box error"
}, Uc = {
  key: 2,
  class: "libretto-detail"
}, jc = { class: "detail-top-nav" }, Vc = { class: "detail-top-actions" }, Bc = ["href"], Hc = { class: "detail-header" }, Kc = { class: "title-row" }, qc = { class: "version-tag" }, Gc = {
  key: 0,
  class: "summary-text"
}, Wc = { class: "tags-row" }, zc = {
  key: 0,
  class: "preview-box"
}, Jc = ["src"], Yc = { class: "detail-section" }, Xc = {
  key: 0,
  class: "missing-alert"
}, Zc = { class: "missing-list" }, Qc = {
  key: 1,
  class: "compatible-alert"
}, eu = {
  key: 2,
  class: "text-muted"
}, tu = { class: "detail-section" }, su = {
  key: 0,
  class: "text-muted"
}, nu = {
  key: 1,
  class: "interface-group"
}, ou = { class: "param-header" }, iu = { class: "param-name" }, ru = { class: "type-badge" }, lu = {
  key: 0,
  class: "param-desc"
}, au = ["onUpdate:modelValue"], cu = ["onUpdate:modelValue"], uu = {
  key: 3,
  class: "param-checkbox-label"
}, fu = ["onUpdate:modelValue"], du = ["onUpdate:modelValue"], pu = {
  key: 2,
  class: "interface-group"
}, hu = {
  key: 0,
  class: "desc-badge"
}, gu = { class: "apply-section" }, vu = {
  key: 1,
  class: "apply-notice-banner"
}, mu = { class: "apply-secondary-row" }, yu = /* @__PURE__ */ Ot({
  __name: "DetailView",
  props: {
    entryId: {}
  },
  emits: ["back", "entry-deleted"],
  setup(e, { emit: t }) {
    const s = e, n = t, o = /* @__PURE__ */ B(null), i = /* @__PURE__ */ B(!0), l = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B([]), a = /* @__PURE__ */ B([]), d = /* @__PURE__ */ B(null), u = /* @__PURE__ */ B({}), p = /* @__PURE__ */ B(Ms());
    async function g() {
      var I, v, m, _;
      i.value = !0, l.value = null;
      try {
        const S = await or(s.entryId);
        o.value = S.entry;
        const K = ((I = S.entry.requirements) == null ? void 0 : I.node_classes) || [], j = Nc(K);
        r.value = j.missing, a.value = j.installed;
        const q = {};
        if ((v = S.entry.interfaces) != null && v.inputs)
          for (const N of S.entry.interfaces.inputs)
            q[N.name] = N.default_value !== null && N.default_value !== void 0 ? N.default_value : N.value_type === "BOOLEAN" ? !1 : N.value_type === "INT" || N.value_type === "FLOAT" ? 0 : "";
        if (Array.isArray((_ = (m = S.entry.workflow) == null ? void 0 : m.data) == null ? void 0 : _.nodes)) {
          for (const N of S.entry.workflow.data.nodes)
            if (N.type === "LibrettoInput" && Array.isArray(N.widgets_values)) {
              const Q = N.widgets_values[0], ie = String(N.widgets_values[1] || "STRING").toUpperCase();
              Q && (ie === "INT" ? q[Q] = N.widgets_values[3] ?? 0 : ie === "FLOAT" ? q[Q] = N.widgets_values[4] ?? 0 : ie === "BOOLEAN" ? q[Q] = !!N.widgets_values[5] : q[Q] = N.widgets_values[2] ?? "");
            }
        }
        u.value = q, p.value = Ms();
      } catch (S) {
        l.value = S.message || "Failed to load entry detail";
      } finally {
        i.value = !1;
      }
    }
    function b(I) {
      var v, m;
      if (!((m = (v = o.value) == null ? void 0 : v.workflow) != null && m.data)) {
        alert("Composition has no workflow data to apply.");
        return;
      }
      if (!(I === "replace" && !confirm("This will replace your current workflow graph. Continue?"))) {
        d.value = null;
        try {
          const _ = lr(o.value.workflow.data, I, u.value);
          if (p.value = Ms(), I === "smart_apply") {
            const S = [];
            _.adjustedCount > 0 && S.push(`Adjusted ${_.adjustedCount} existing node(s)`), _.addedCount > 0 && S.push(`Added ${_.addedCount} new node(s)`), d.value = S.length > 0 ? S.join(", ") : "Applied to graph.";
          } else I === "insert_copy" ? d.value = `Inserted ${_.addedCount} duplicate node(s).` : d.value = "Active graph replaced.";
          setTimeout(() => {
            d.value = null;
          }, 4500);
        } catch (_) {
          alert(`Could not apply workflow: ${_.message}`);
        }
      }
    }
    function M() {
      const I = Ic();
      p.value = Ms(), I && (d.value = "Graph restored to previous state.", setTimeout(() => {
        d.value = null;
      }, 3500));
    }
    async function E() {
      if (o.value && confirm(`Are you sure you want to delete "${o.value.title}"?`))
        try {
          await Ga(o.value.id, o.value.content_hash), n("entry-deleted");
        } catch (I) {
          alert(`Delete failed: ${I.message}`);
        }
    }
    return Nt(() => {
      g();
    }), (I, v) => {
      var m;
      return i.value ? (x(), A("div", Dc, [...v[5] || (v[5] = [
        c("span", { class: "spinner" }, null, -1),
        Be(" Loading composition details... ", -1)
      ])])) : l.value ? (x(), A("div", Fc, [
        c("p", null, H(l.value), 1),
        c("button", {
          class: "libretto-btn",
          onClick: v[0] || (v[0] = (_) => I.$emit("back"))
        }, "Back to Library")
      ])) : o.value ? (x(), A("div", Uc, [
        c("div", jc, [
          c("button", {
            class: "libretto-btn btn-sm",
            onClick: v[1] || (v[1] = (_) => I.$emit("back"))
          }, " ← Back "),
          c("div", Vc, [
            c("a", {
              href: hs(Ja)(o.value.id),
              download: "",
              class: "libretto-btn btn-sm",
              title: "Export as portable package"
            }, " Export ", 8, Bc),
            c("button", {
              class: "libretto-btn btn-sm danger",
              onClick: E
            }, " Delete ")
          ])
        ]),
        c("div", Hc, [
          c("div", Kc, [
            c("h3", null, H(o.value.title), 1),
            c("span", qc, "v" + H(o.value.version), 1)
          ]),
          o.value.summary ? (x(), A("p", Gc, H(o.value.summary), 1)) : oe("", !0),
          c("div", Wc, [
            (x(!0), A(ye, null, je(o.value.tags, (_) => (x(), A("span", {
              key: _,
              class: "tag-chip"
            }, "#" + H(_), 1))), 128))
          ])
        ]),
        (m = o.value.assets) != null && m.preview ? (x(), A("div", zc, [
          c("img", {
            src: hs(Ya)(o.value.assets.preview),
            alt: "Preview",
            class: "preview-img"
          }, null, 8, Jc)
        ])) : oe("", !0),
        c("div", Yc, [
          v[7] || (v[7] = c("h5", { class: "section-title" }, "Requirements & Compatibility", -1)),
          r.value.length > 0 ? (x(), A("div", Xc, [
            c("strong", null, "Missing Custom Nodes (" + H(r.value.length) + "):", 1),
            v[6] || (v[6] = c("p", { class: "missing-desc" }, "The following node classes are required by this composition but are not currently loaded in ComfyUI:", -1)),
            c("ul", Zc, [
              (x(!0), A(ye, null, je(r.value, (_) => (x(), A("li", { key: _ }, H(_), 1))), 128))
            ])
          ])) : a.value.length > 0 ? (x(), A("div", Qc, " All " + H(a.value.length) + " required node classes are installed and ready. ", 1)) : (x(), A("div", eu, " No specific custom node requirements recorded. "))
        ]),
        c("div", tu, [
          v[11] || (v[11] = c("h5", { class: "section-title" }, "Composition Interfaces", -1)),
          o.value.interfaces.inputs.length === 0 && o.value.interfaces.outputs.length === 0 ? (x(), A("div", su, " No LibrettoInput or LibrettoOutput sockets declared. ")) : oe("", !0),
          o.value.interfaces.inputs.length > 0 ? (x(), A("div", nu, [
            v[9] || (v[9] = c("span", { class: "interface-group-label" }, "Composition Parameters (Adjust Before Applying):", -1)),
            (x(!0), A(ye, null, je(o.value.interfaces.inputs, (_) => (x(), A("div", {
              key: _.name,
              class: "param-control-card"
            }, [
              c("div", ou, [
                c("span", iu, H(_.name), 1),
                c("span", ru, H(_.value_type), 1)
              ]),
              _.description ? (x(), A("p", lu, H(_.description), 1)) : oe("", !0),
              _.value_type === "INT" ? me((x(), A("input", {
                key: 1,
                "onUpdate:modelValue": (S) => u.value[_.name] = S,
                type: "number",
                class: "libretto-input param-input"
              }, null, 8, au)), [
                [
                  Ce,
                  u.value[_.name],
                  void 0,
                  { number: !0 }
                ]
              ]) : _.value_type === "FLOAT" ? me((x(), A("input", {
                key: 2,
                "onUpdate:modelValue": (S) => u.value[_.name] = S,
                type: "number",
                step: "0.05",
                class: "libretto-input param-input"
              }, null, 8, cu)), [
                [
                  Ce,
                  u.value[_.name],
                  void 0,
                  { number: !0 }
                ]
              ]) : _.value_type === "BOOLEAN" ? (x(), A("label", uu, [
                me(c("input", {
                  "onUpdate:modelValue": (S) => u.value[_.name] = S,
                  type: "checkbox"
                }, null, 8, fu), [
                  [sr, u.value[_.name]]
                ]),
                v[8] || (v[8] = c("span", null, "Enable", -1))
              ])) : me((x(), A("input", {
                key: 4,
                "onUpdate:modelValue": (S) => u.value[_.name] = S,
                type: "text",
                class: "libretto-input param-input"
              }, null, 8, du)), [
                [Ce, u.value[_.name]]
              ])
            ]))), 128))
          ])) : oe("", !0),
          o.value.interfaces.outputs.length > 0 ? (x(), A("div", pu, [
            v[10] || (v[10] = c("span", { class: "interface-group-label" }, "Declared Outputs:", -1)),
            (x(!0), A(ye, null, je(o.value.interfaces.outputs, (_) => (x(), A("div", {
              key: _.name,
              class: "interface-pill output-pill"
            }, [
              c("strong", null, H(_.name), 1),
              _.description ? (x(), A("span", hu, H(_.description), 1)) : oe("", !0)
            ]))), 128))
          ])) : oe("", !0)
        ]),
        c("div", gu, [
          c("button", {
            class: "libretto-btn primary full-width",
            onClick: v[2] || (v[2] = (_) => b("smart_apply"))
          }, " Apply / Adjust Active Graph "),
          p.value ? (x(), A("button", {
            key: 0,
            class: "libretto-btn full-width revert-btn",
            onClick: M
          }, " ↺ Revert / Undo Last Apply ")) : oe("", !0),
          d.value ? (x(), A("div", vu, H(d.value), 1)) : oe("", !0),
          c("div", mu, [
            c("button", {
              class: "libretto-btn btn-sm text-xs",
              onClick: v[3] || (v[3] = (_) => b("insert_copy"))
            }, " Insert Duplicate "),
            c("button", {
              class: "libretto-btn btn-sm text-xs",
              onClick: v[4] || (v[4] = (_) => b("replace"))
            }, " Replace Entire Graph ")
          ])
        ])
      ])) : oe("", !0);
    };
  }
}), bu = /* @__PURE__ */ Wt(yu, [["__scopeId", "data-v-abc57dca"]]), _u = { class: "modal-dialog preset-browser-dialog" }, wu = { class: "toast-icon" }, Cu = { class: "modal-header" }, xu = { class: "title-group" }, $u = { class: "count-badge" }, ku = { class: "header-actions" }, Su = { class: "browser-controls" }, Tu = { class: "search-and-source-row" }, Au = { class: "source-toggle-group" }, Eu = { class: "category-filter-row" }, Pu = ["onClick"], Iu = { class: "preset-grid-container" }, Lu = {
  key: 0,
  class: "loading-state"
}, Ou = {
  key: 1,
  class: "empty-state"
}, Nu = {
  key: 2,
  class: "preset-grid"
}, Mu = ["onClick"], Ru = { class: "preset-thumb-box" }, Du = ["src", "alt", "onError"], Fu = {
  key: 2,
  class: "custom-badge",
  title: "User custom preset"
}, Uu = ["onClick"], ju = { class: "preset-card-body" }, Vu = ["title"], Bu = ["title"], Hu = {
  key: 0,
  class: "item-stepper"
}, Ku = ["onClick"], qu = { class: "step-count" }, Gu = ["onClick"], Wu = ["onClick"], zu = { class: "modal-footer" }, Ju = { class: "footer-status" }, Yu = {
  key: 0,
  class: "added-summary-pill"
}, Xu = {
  key: 1,
  class: "hint-text"
}, Zu = { class: "footer-buttons" }, Qu = { class: "nested-dialog" }, ef = { class: "nested-dialog-header" }, tf = { class: "nested-dialog-body" }, sf = { class: "dialog-field" }, nf = { class: "thumb-uploader-box" }, of = {
  key: 0,
  class: "thumb-preview-wrap"
}, rf = ["src"], lf = {
  key: 1,
  class: "thumb-drop-zone"
}, af = { class: "dialog-field" }, cf = { class: "dialog-field" }, uf = ["value"], ff = { class: "dialog-field" }, df = { class: "dialog-field" }, pf = { class: "dialog-field-row" }, hf = {
  class: "dialog-field",
  style: { flex: "1" }
}, gf = {
  class: "dialog-field",
  style: { flex: "2" }
}, vf = { class: "nested-dialog-footer" }, mf = ["disabled"], yf = { class: "nested-dialog" }, bf = { class: "nested-dialog-header" }, _f = { class: "nested-dialog-body" }, wf = { class: "import-drop-zone" }, Cf = { class: "nested-dialog-footer" }, xf = /* @__PURE__ */ Ot({
  __name: "PresetBrowserModal",
  props: {
    initialCounts: {}
  },
  emits: ["close", "select", "deselect"],
  setup(e, { emit: t }) {
    const s = e, n = t, o = /* @__PURE__ */ B([]), i = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B(0), r = /* @__PURE__ */ B(0), a = /* @__PURE__ */ B(0), d = /* @__PURE__ */ B(0), u = /* @__PURE__ */ B(""), p = /* @__PURE__ */ B("all"), g = /* @__PURE__ */ B(""), b = /* @__PURE__ */ B(!1), M = /* @__PURE__ */ B({}), E = /* @__PURE__ */ B({ ...s.initialCounts || {} }), I = /* @__PURE__ */ B(""), v = /* @__PURE__ */ B("info");
    let m = null;
    function _(G, C = "info") {
      I.value = G, v.value = C, clearTimeout(m), m = setTimeout(() => {
        I.value = "";
      }, 2800);
    }
    const S = /* @__PURE__ */ B(!1), K = /* @__PURE__ */ B(!1), j = /* @__PURE__ */ B(null), q = /* @__PURE__ */ B(null), N = /* @__PURE__ */ B({
      name: "",
      category: "character",
      keywords: "",
      negative: "",
      weight: 1,
      description: ""
    });
    function Q() {
      j.value = null, q.value = null, N.value = {
        name: "",
        category: u.value || "character",
        keywords: "",
        negative: "",
        weight: 1,
        description: ""
      }, S.value = !0;
    }
    function ie(G) {
      const C = G.target;
      if (!C.files || C.files.length === 0) return;
      const L = C.files[0], we = new FileReader();
      we.onload = ($t) => {
        var f;
        const cn = (f = $t.target) == null ? void 0 : f.result;
        j.value = cn, q.value = cn;
      }, we.readAsDataURL(L);
    }
    function ae() {
      j.value = null, q.value = null;
    }
    const R = Cs(() => Object.values(E.value).reduce((G, C) => G + C, 0));
    let re = null;
    function $e() {
      clearTimeout(re), re = setTimeout(Y, 200);
    }
    function Z(G) {
      u.value = G, Y();
    }
    function X(G) {
      p.value = G, Y();
    }
    async function Y() {
      b.value = !0;
      try {
        const G = await tc({
          category: u.value || void 0,
          q: g.value || void 0,
          source: p.value,
          limit: 300
        });
        i.value = G.items, l.value = G.total, G.total_all !== void 0 && (r.value = G.total_all), G.total_bundled !== void 0 && (a.value = G.total_bundled), G.total_custom !== void 0 && (d.value = G.total_custom);
      } catch (G) {
        console.warn("Failed to load library presets", G);
      } finally {
        b.value = !1;
      }
    }
    function w(G) {
      E.value[G.id] = (E.value[G.id] || 0) + 1, n("select", G);
    }
    function O(G) {
      !E.value[G.id] || E.value[G.id] <= 0 || (E.value[G.id]--, E.value[G.id] === 0 && delete E.value[G.id], n("deselect", G));
    }
    function te(G) {
      M.value[G] = !0;
    }
    async function ce() {
      if (N.value.name.trim())
        try {
          const G = { ...N.value };
          q.value && (G.thumbnail_base64 = q.value);
          const C = await ir(G);
          _(`✓ Created preset "${C.preset.name}"`, "success"), S.value = !1, await Y();
        } catch (G) {
          _(`Failed: ${G.message}`, "error");
        }
    }
    async function he(G) {
      if (confirm(`Are you sure you want to delete custom preset "${G.name}"?`))
        try {
          await sc(G.category, G.id), _(`Deleted preset "${G.name}"`, "info"), await Y();
        } catch (C) {
          _(`Failed to delete: ${C.message}`, "error");
        }
    }
    function Te() {
      const G = nc(u.value || void 0, !0), C = document.createElement("a");
      C.href = G, C.download = `libretto_presets_${u.value || "all"}.zip`, document.body.appendChild(C), C.click(), document.body.removeChild(C), _("Downloading presets pack...", "info");
    }
    async function se(G) {
      const C = G.target;
      if (!C.files || C.files.length === 0) return;
      const L = C.files[0];
      try {
        const we = await oc(L);
        _(`✓ Successfully imported ${we.imported_presets} preset(s)!`, "success"), K.value = !1, await Y();
      } catch (we) {
        _(`Import failed: ${we.message}`, "error");
      } finally {
        C.value = "";
      }
    }
    return Nt(async () => {
      try {
        o.value = await Qa();
      } catch {
        o.value = [];
      }
      Y();
    }), (G, C) => (x(), A("div", {
      class: "modal-backdrop",
      onClick: C[21] || (C[21] = De((L) => G.$emit("close"), ["self"]))
    }, [
      c("div", _u, [
        Oe(tr, { name: "toast-fade" }, {
          default: Wn(() => [
            I.value ? (x(), A("div", {
              key: 0,
              class: Pe(["modal-floating-toast", v.value])
            }, [
              c("span", wu, H(v.value === "success" ? "✓" : v.value === "error" ? "✕" : "ℹ"), 1),
              Be(" " + H(I.value), 1)
            ], 2)) : oe("", !0)
          ]),
          _: 1
        }),
        c("div", Cu, [
          c("div", xu, [
            C[22] || (C[22] = c("h3", { class: "modal-title" }, "Library Presets Browser", -1)),
            c("span", $u, H(l.value) + " presets", 1)
          ]),
          c("div", ku, [
            c("button", {
              class: "new-preset-btn",
              onClick: Q
            }, " + New Preset "),
            c("button", {
              class: "icon-tool-btn",
              title: "Export Presets Pack (.zip)",
              onClick: Te
            }, " 📥 Export Pack "),
            c("button", {
              class: "icon-tool-btn",
              title: "Import Presets (.zip, .yaml, .json)",
              onClick: C[0] || (C[0] = (L) => K.value = !0)
            }, " 📤 Import "),
            c("button", {
              class: "close-btn",
              onClick: C[1] || (C[1] = (L) => G.$emit("close"))
            }, "×")
          ])
        ]),
        c("div", Su, [
          c("div", Tu, [
            me(c("input", {
              "onUpdate:modelValue": C[2] || (C[2] = (L) => g.value = L),
              type: "text",
              class: "browser-search-input",
              placeholder: "Search presets by name, tags, description...",
              onInput: $e
            }, null, 544), [
              [Ce, g.value]
            ]),
            c("div", Au, [
              c("button", {
                class: Pe(["source-btn", { active: p.value === "all" }]),
                onClick: C[3] || (C[3] = (L) => X("all"))
              }, " All (" + H(r.value) + ") ", 3),
              c("button", {
                class: Pe(["source-btn", { active: p.value === "bundled" }]),
                onClick: C[4] || (C[4] = (L) => X("bundled"))
              }, " Bundled (" + H(a.value) + ") ", 3),
              c("button", {
                class: Pe(["source-btn", { active: p.value === "user" }]),
                onClick: C[5] || (C[5] = (L) => X("user"))
              }, " Custom (" + H(d.value) + ") ", 3)
            ])
          ]),
          c("div", Eu, [
            c("button", {
              class: Pe(["cat-filter-btn", { active: u.value === "" }]),
              onClick: C[6] || (C[6] = (L) => Z(""))
            }, " All Categories ", 2),
            (x(!0), A(ye, null, je(o.value, (L) => {
              var we;
              return x(), A("button", {
                key: L.id,
                class: Pe(["cat-filter-btn", { active: u.value === L.id }]),
                style: Yt(u.value === L.id ? { borderColor: L.color || "#3b82f6", color: L.color || "#60a5fa" } : {}),
                onClick: ($t) => Z(L.id)
              }, H(((we = L.names) == null ? void 0 : we["en-US"]) || L.name || L.id), 15, Pu);
            }), 128))
          ])
        ]),
        c("div", Iu, [
          b.value ? (x(), A("div", Lu, [...C[23] || (C[23] = [
            c("span", null, "Loading presets...", -1)
          ])])) : i.value.length === 0 ? (x(), A("div", Ou, [
            C[24] || (C[24] = c("p", null, "No presets found in this filter.", -1)),
            p.value === "user" ? (x(), A("button", {
              key: 0,
              class: "new-preset-btn",
              onClick: Q
            }, " + Create Your First Custom Preset ")) : oe("", !0)
          ])) : (x(), A("div", Nu, [
            (x(!0), A(ye, null, je(i.value, (L) => (x(), A("div", {
              key: L.id,
              class: Pe(["preset-card", { selected: (E.value[L.id] || 0) > 0 }]),
              onClick: (we) => w(L)
            }, [
              c("div", Ru, [
                L.has_thumb && !M.value[L.id] ? (x(), A("img", {
                  key: 0,
                  src: hs(ic)(L.folder || L.category, L.id),
                  alt: L.name,
                  class: "preset-thumb-img",
                  loading: "lazy",
                  onError: (we) => te(L.id)
                }, null, 40, Du)) : (x(), A("div", {
                  key: 1,
                  class: "preset-thumb-fallback",
                  style: Yt({ backgroundColor: (L.color || "#3b82f6") + "22", color: L.color || "#818cf8" })
                }, [
                  c("span", null, H((L.name || L.id).substring(0, 2).toUpperCase()), 1)
                ], 4)),
                c("span", {
                  class: "card-category-badge",
                  style: Yt({ backgroundColor: L.color || "#4b5563" })
                }, H(L.category), 5),
                L.is_custom ? (x(), A("span", Fu, " Custom ")) : oe("", !0),
                L.is_custom ? (x(), A("button", {
                  key: 3,
                  class: "delete-preset-icon-btn",
                  title: "Delete custom preset",
                  onClick: De((we) => he(L), ["stop"])
                }, " × ", 8, Uu)) : oe("", !0)
              ]),
              c("div", ju, [
                c("h4", {
                  class: "preset-title",
                  title: L.name
                }, H(L.name), 9, Vu),
                c("p", {
                  class: "preset-keywords",
                  title: L.keywords
                }, H(L.keywords || L.description), 9, Bu)
              ]),
              c("div", {
                class: "card-action-bar",
                onClick: C[7] || (C[7] = De(() => {
                }, ["stop"]))
              }, [
                (E.value[L.id] || 0) > 0 ? (x(), A("div", Hu, [
                  c("button", {
                    class: "step-btn minus-btn",
                    title: "Remove / Deselect one",
                    onClick: De((we) => O(L), ["stop"])
                  }, " − ", 8, Ku),
                  c("span", qu, "Added (" + H(E.value[L.id]) + ")", 1),
                  c("button", {
                    class: "step-btn plus-btn",
                    title: "Add another",
                    onClick: De((we) => w(L), ["stop"])
                  }, " + ", 8, Gu)
                ])) : (x(), A("button", {
                  key: 1,
                  class: "add-preset-btn",
                  onClick: De((we) => w(L), ["stop"])
                }, " + Add ", 8, Wu))
              ])
            ], 10, Mu))), 128))
          ]))
        ]),
        c("div", zu, [
          c("div", Ju, [
            R.value > 0 ? (x(), A("span", Yu, " ✓ " + H(R.value) + " preset(s) active in composition ", 1)) : (x(), A("span", Xu, " Click any preset or + to add. Use − to deselect. "))
          ]),
          c("div", Zu, [
            c("button", {
              class: "primary-done-btn",
              onClick: C[8] || (C[8] = (L) => G.$emit("close"))
            }, H(R.value > 0 ? `Done (${R.value} Added)` : "Close"), 1)
          ])
        ])
      ]),
      S.value ? (x(), A("div", {
        key: 0,
        class: "nested-dialog-backdrop",
        onClick: C[17] || (C[17] = De((L) => S.value = !1, ["self"]))
      }, [
        c("div", Qu, [
          c("div", ef, [
            C[25] || (C[25] = c("h4", null, "Create New Custom Preset", -1)),
            c("button", {
              class: "close-btn",
              onClick: C[9] || (C[9] = (L) => S.value = !1)
            }, "×")
          ]),
          c("div", tf, [
            c("div", sf, [
              C[29] || (C[29] = c("label", null, "Thumbnail / Image (Optional)", -1)),
              c("div", nf, [
                j.value ? (x(), A("div", of, [
                  c("img", {
                    src: j.value,
                    alt: "Preset Thumbnail",
                    class: "thumb-preview-img"
                  }, null, 8, rf),
                  c("button", {
                    class: "remove-thumb-btn",
                    onClick: ae
                  }, "× Remove Image")
                ])) : (x(), A("label", lf, [
                  C[26] || (C[26] = c("span", { class: "drop-icon" }, "📷", -1)),
                  C[27] || (C[27] = c("span", { class: "drop-text" }, "Click to choose image or drag & drop", -1)),
                  C[28] || (C[28] = c("span", { class: "drop-sub" }, "(PNG, JPG, WebP)", -1)),
                  c("input", {
                    type: "file",
                    accept: "image/png,image/jpeg,image/webp",
                    style: { display: "none" },
                    onChange: ie
                  }, null, 32)
                ]))
              ])
            ]),
            c("div", af, [
              C[30] || (C[30] = c("label", null, "Preset Name *", -1)),
              me(c("input", {
                "onUpdate:modelValue": C[10] || (C[10] = (L) => N.value.name = L),
                type: "text",
                placeholder: "e.g. Cyberpunk Katana Girl",
                class: "dialog-input"
              }, null, 512), [
                [Ce, N.value.name]
              ])
            ]),
            c("div", cf, [
              C[31] || (C[31] = c("label", null, "Category", -1)),
              me(c("select", {
                "onUpdate:modelValue": C[11] || (C[11] = (L) => N.value.category = L),
                class: "dialog-select"
              }, [
                (x(!0), A(ye, null, je(o.value, (L) => {
                  var we;
                  return x(), A("option", {
                    key: L.id,
                    value: L.id
                  }, H(((we = L.names) == null ? void 0 : we["en-US"]) || L.name || L.id), 9, uf);
                }), 128))
              ], 512), [
                [an, N.value.category]
              ])
            ]),
            c("div", ff, [
              C[32] || (C[32] = c("label", null, "Keywords / Positive Prompt *", -1)),
              me(c("textarea", {
                "onUpdate:modelValue": C[12] || (C[12] = (L) => N.value.keywords = L),
                rows: "3",
                placeholder: "e.g. 1girl, cyberpunk jacket, glowing katana",
                class: "dialog-textarea"
              }, null, 512), [
                [Ce, N.value.keywords]
              ])
            ]),
            c("div", df, [
              C[33] || (C[33] = c("label", null, "Negative Prompt (optional)", -1)),
              me(c("textarea", {
                "onUpdate:modelValue": C[13] || (C[13] = (L) => N.value.negative = L),
                rows: "2",
                placeholder: "e.g. low quality, blurry",
                class: "dialog-textarea"
              }, null, 512), [
                [Ce, N.value.negative]
              ])
            ]),
            c("div", pf, [
              c("div", hf, [
                C[34] || (C[34] = c("label", null, "Weight", -1)),
                me(c("input", {
                  "onUpdate:modelValue": C[14] || (C[14] = (L) => N.value.weight = L),
                  type: "number",
                  step: "0.05",
                  min: "0.1",
                  max: "3.0",
                  class: "dialog-input"
                }, null, 512), [
                  [
                    Ce,
                    N.value.weight,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              c("div", gf, [
                C[35] || (C[35] = c("label", null, "Description / Note", -1)),
                me(c("input", {
                  "onUpdate:modelValue": C[15] || (C[15] = (L) => N.value.description = L),
                  type: "text",
                  placeholder: "Short description",
                  class: "dialog-input"
                }, null, 512), [
                  [Ce, N.value.description]
                ])
              ])
            ])
          ]),
          c("div", vf, [
            c("button", {
              class: "secondary-btn",
              onClick: C[16] || (C[16] = (L) => S.value = !1)
            }, "Cancel"),
            c("button", {
              class: "primary-done-btn",
              disabled: !N.value.name.trim(),
              onClick: ce
            }, " Save Preset ", 8, mf)
          ])
        ])
      ])) : oe("", !0),
      K.value ? (x(), A("div", {
        key: 1,
        class: "nested-dialog-backdrop",
        onClick: C[20] || (C[20] = De((L) => K.value = !1, ["self"]))
      }, [
        c("div", yf, [
          c("div", bf, [
            C[36] || (C[36] = c("h4", null, "Import Presets Pack or Files", -1)),
            c("button", {
              class: "close-btn",
              onClick: C[18] || (C[18] = (L) => K.value = !1)
            }, "×")
          ]),
          c("div", _f, [
            C[40] || (C[40] = Jl('<div class="import-info-box" data-v-2216bc6e><p class="info-title" data-v-2216bc6e>📚 Supported Import Formats:</p><ul class="info-list" data-v-2216bc6e><li data-v-2216bc6e><strong data-v-2216bc6e>Libretto Preset Pack (.zip):</strong> Full zip bundle exported from Libretto containing categories, presets, and thumbnails.</li><li data-v-2216bc6e><strong data-v-2216bc6e>Single Preset (.yaml, .yml):</strong> Standalone preset definition file.</li><li data-v-2216bc6e><strong data-v-2216bc6e>JSON Preset (.json):</strong> Preset metadata object.</li></ul><p class="info-sub" data-v-2216bc6e>Imported presets will be automatically saved into your <code data-v-2216bc6e>user_presets/</code> directory so they are preserved across updates.</p></div>', 1)),
            c("label", wf, [
              C[37] || (C[37] = c("span", { class: "drop-icon" }, "📤", -1)),
              C[38] || (C[38] = c("span", { class: "drop-text" }, "Click to browse file or drag & drop", -1)),
              C[39] || (C[39] = c("span", { class: "drop-sub" }, "(.zip, .yaml, .yml, .json)", -1)),
              c("input", {
                type: "file",
                accept: ".zip,.yaml,.yml,.json",
                style: { display: "none" },
                onChange: se
              }, null, 32)
            ])
          ]),
          c("div", Cf, [
            c("button", {
              class: "secondary-btn",
              onClick: C[19] || (C[19] = (L) => K.value = !1)
            }, "Close")
          ])
        ])
      ])) : oe("", !0)
    ]));
  }
}), $f = /* @__PURE__ */ Wt(xf, [["__scopeId", "data-v-2216bc6e"]]), kf = { class: "prompt-composer-view" }, Sf = { class: "toast-icon" }, Tf = { class: "composer-section profile-card" }, Af = { class: "section-title-row" }, Ef = { class: "profile-badge" }, Pf = { class: "profile-selector-group" }, If = ["value"], Lf = { class: "profile-hint" }, Of = { class: "composer-section" }, Nf = { class: "section-title-row" }, Mf = { class: "quick-add-ribbon" }, Rf = ["onClick"], Df = { class: "composer-section components-section" }, Ff = { class: "section-title-row" }, Uf = { class: "section-label" }, jf = {
  key: 0,
  class: "empty-components-state"
}, Vf = {
  key: 1,
  class: "component-card-list"
}, Bf = { class: "component-header" }, Hf = ["onUpdate:modelValue"], Kf = { class: "weight-control" }, qf = ["onUpdate:modelValue"], Gf = ["onClick"], Wf = ["onClick"], zf = { class: "component-body" }, Jf = { class: "input-row" }, Yf = ["onUpdate:modelValue"], Xf = { class: "input-row" }, Zf = ["onUpdate:modelValue"], Qf = {
  key: 0,
  class: "input-row"
}, ed = ["onUpdate:modelValue"], td = { class: "composer-section" }, sd = { class: "input-row" }, nd = {
  key: 0,
  class: "input-row"
}, od = { class: "composer-section preview-section" }, id = { class: "compiled-output-card positive-card" }, rd = { class: "output-header" }, ld = { class: "output-content" }, ad = {
  key: 0,
  class: "compiled-output-card negative-card"
}, cd = { class: "output-header" }, ud = { class: "output-content" }, fd = {
  key: 1,
  class: "loras-ribbon"
}, jo = "comfyui_libretto_composer_state_v1", dd = /* @__PURE__ */ Ot({
  __name: "PromptComposerView",
  setup(e) {
    const t = /* @__PURE__ */ B([]), s = /* @__PURE__ */ B("sdxl"), n = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B({
      show: !1,
      message: "",
      type: "success"
    });
    let r = null;
    function a(w, O = "success") {
      clearTimeout(r), l.value = { show: !0, message: w, type: O }, r = setTimeout(() => {
        l.value.show = !1;
      }, 2800);
    }
    function d() {
      re(), m(), a("✓ Prompt refreshed", "info");
    }
    const u = /* @__PURE__ */ B([
      {
        name: "Character",
        category: "character",
        keywords: "1girl, solo, silver hair, bangs, blue eyes",
        description: "A beautiful young woman with long silver hair styled with front bangs and radiant blue eyes",
        negative: "",
        weight: 1
      },
      {
        name: "Outfit",
        category: "costume",
        keywords: "cyberpunk leather jacket, luminous circuit accents, dark trousers",
        description: "Wearing a stylish cyberpunk leather jacket with subtle glowing circuitry",
        negative: "",
        weight: 1
      },
      {
        name: "Environment",
        category: "environment",
        keywords: "tokyo rain street, neon signage, wet asphalt reflections",
        description: "Standing in a rain-slicked Tokyo alley illuminated by colourful neon billboards",
        negative: "",
        weight: 1
      }
    ]), p = /* @__PURE__ */ B(""), g = /* @__PURE__ */ B(""), b = /* @__PURE__ */ B([]), M = [
      { id: "character", name: "Character" },
      { id: "costume", name: "Outfit" },
      { id: "hair", name: "Hair" },
      { id: "pose", name: "Pose" },
      { id: "expression", name: "Expression" },
      { id: "environment", name: "Environment" },
      { id: "lighting", name: "Lighting" },
      { id: "camera", name: "Camera" },
      { id: "style", name: "Art Style" }
    ], E = Cs(() => t.value.find((w) => w.id === s.value) || null), I = Cs(() => {
      const w = {};
      for (const O of u.value) {
        const te = O.id || O.name;
        te && (w[te] = (w[te] || 0) + 1);
      }
      return w;
    });
    function v(w) {
      switch (w) {
        case "sdxl":
          return "Optimized for SDXL: Comma-separated tag ordering with automatic quality prefix tags and weight formatting.";
        case "pony":
          return "Optimized for Pony Diffusion V6: Prepends score_9 quality ratings and enforces tag-based anime formatting.";
        case "flux":
          return "Optimized for Flux.1: Uses natural language descriptive sentences joined with periods. Disables tag spam.";
        case "sd15":
          return "Optimized for Stable Diffusion 1.5: Classic tag weighting (keyword:1.2), masterpiece quality prefix, and negative tokens.";
        case "animagine":
          return "Optimized for Animagine XL & NoobAI: Score tags and Danbooru anime formatting.";
        case "illustrious":
          return "Optimized for Illustrious XL: Aesthetic ratings and anime quality tokens.";
        case "photoreal":
          return "Optimized for Photorealism: Cinematic 35mm film photography and realistic natural lighting.";
        default:
          return "Standard configuration.";
      }
    }
    function m() {
      try {
        const w = {
          components: u.value,
          selectedProfileId: s.value,
          extraPositive: n.value,
          extraNegative: o.value
        };
        localStorage.setItem(jo, JSON.stringify(w));
      } catch {
      }
    }
    function _() {
      try {
        const w = localStorage.getItem(jo);
        if (w) {
          const O = JSON.parse(w);
          Array.isArray(O.components) && O.components.length > 0 && (u.value = O.components), O.selectedProfileId && (s.value = O.selectedProfileId), typeof O.extraPositive == "string" && (n.value = O.extraPositive), typeof O.extraNegative == "string" && (o.value = O.extraNegative);
        }
      } catch {
      }
    }
    function S(w, O) {
      u.value.push({
        name: O,
        category: w,
        keywords: "",
        description: "",
        negative: "",
        weight: 1
      }), R(), m();
    }
    function K(w) {
      u.value.splice(w, 1), R(), m();
    }
    function j() {
      u.value = [], R(), m(), a("Cleared active components (extra globals preserved)", "info");
    }
    function q() {
      R(), m();
    }
    function N() {
      R(), m();
    }
    async function Q(w) {
      const O = w.name.trim() || `${w.category} Preset`;
      try {
        await ir({
          name: O,
          category: w.category,
          keywords: w.keywords,
          negative: w.negative,
          weight: w.weight,
          description: w.description
        }), a(`✓ Saved "${O}" to user library!`, "success");
      } catch (te) {
        a(`Save failed: ${te.message}`, "error");
      }
    }
    function ie() {
      R(), m();
    }
    let ae = null;
    function R() {
      clearTimeout(ae), ae = setTimeout(re, 250);
    }
    async function re() {
      try {
        const w = await ec({
          profile_id: s.value,
          components: u.value,
          extra_positive: n.value,
          extra_negative: o.value
        });
        p.value = w.positive, g.value = w.negative, b.value = w.loras || [];
      } catch (w) {
        console.warn("Failed to compile prompt preview", w);
      }
    }
    function $e(w) {
      u.value.push({
        id: w.id,
        name: w.name,
        category: w.category,
        keywords: w.keywords,
        description: w.description || w.keywords,
        negative: w.negative || "",
        weight: w.weight || 1
      }), R(), m(), a(`✓ Added "${w.name}"`, "success");
    }
    function Z(w) {
      let O = -1;
      for (let te = u.value.length - 1; te >= 0; te--) {
        const ce = u.value[te];
        if (ce.id === w.id || ce.name === w.name && ce.category === w.category) {
          O = te;
          break;
        }
      }
      O !== -1 && (u.value.splice(O, 1), R(), m(), a(`Removed 1 × "${w.name}"`, "info"));
    }
    async function X(w, O) {
      if (w)
        try {
          await navigator.clipboard.writeText(w), a(`✓ Copied ${O} to clipboard!`, "success");
        } catch (te) {
          a(`Failed to copy: ${te}`, "error");
        }
    }
    function Y() {
      const w = Rc(
        s.value,
        u.value,
        p.value,
        g.value
      );
      a(w.message, w.success ? "success" : "error");
    }
    return Nt(async () => {
      _();
      try {
        t.value = await Za();
      } catch {
        t.value = [];
      }
      re();
    }), (w, O) => {
      var te, ce, he, Te;
      return x(), A("div", kf, [
        Oe(tr, { name: "toast-fade" }, {
          default: Wn(() => [
            l.value.show ? (x(), A("div", {
              key: 0,
              class: Pe(["composer-floating-toast", l.value.type])
            }, [
              c("span", Sf, H(l.value.type === "success" ? "✓" : l.value.type === "error" ? "✕" : "ℹ"), 1),
              c("span", null, H(l.value.message), 1)
            ], 2)) : oe("", !0)
          ]),
          _: 1
        }),
        c("div", Tf, [
          c("div", Af, [
            O[7] || (O[7] = c("label", { class: "section-label" }, "Target Model Profile", -1)),
            c("span", Ef, H(((ce = (te = E.value) == null ? void 0 : te.target_model) == null ? void 0 : ce.toUpperCase()) || "TAGS"), 1)
          ]),
          c("div", Pf, [
            me(c("select", {
              "onUpdate:modelValue": O[0] || (O[0] = (se) => s.value = se),
              class: "profile-select",
              onChange: ie
            }, [
              (x(!0), A(ye, null, je(t.value, (se) => (x(), A("option", {
                key: se.id,
                value: se.id
              }, H(se.name), 9, If))), 128))
            ], 544), [
              [an, s.value]
            ])
          ]),
          c("p", Lf, H(v(s.value)), 1)
        ]),
        c("div", Of, [
          c("div", Nf, [
            O[8] || (O[8] = c("label", { class: "section-label" }, "Add Component", -1)),
            c("button", {
              class: "browse-lib-text-btn",
              onClick: O[1] || (O[1] = (se) => i.value = !0)
            }, " 📚 Browse Presets (" + H(u.value.length) + " Active) ", 1)
          ]),
          c("div", Mf, [
            (x(), A(ye, null, je(M, (se) => c("button", {
              key: se.id,
              class: "ribbon-btn",
              onClick: (G) => S(se.id, se.name)
            }, " + " + H(se.name), 9, Rf)), 64))
          ])
        ]),
        c("div", Df, [
          c("div", Ff, [
            c("label", Uf, "Active Prompt Components (" + H(u.value.length) + ")", 1),
            u.value.length > 0 ? (x(), A("button", {
              key: 0,
              class: "text-action-btn",
              title: "Remove all active prompt component cards",
              onClick: j
            }, " Clear Components ")) : oe("", !0)
          ]),
          u.value.length === 0 ? (x(), A("div", jf, [...O[9] || (O[9] = [
            c("p", null, "No components added yet.", -1),
            c("p", { class: "sub-text" }, 'Click a category above or "Browse Presets" to build your structured prompt.', -1)
          ])])) : (x(), A("div", Vf, [
            (x(!0), A(ye, null, je(u.value, (se, G) => {
              var C;
              return x(), A("div", {
                key: G,
                class: "component-card"
              }, [
                c("div", Bf, [
                  c("span", {
                    class: Pe(["category-pill", se.category])
                  }, H(se.category), 3),
                  me(c("input", {
                    "onUpdate:modelValue": (L) => se.name = L,
                    class: "component-name-input",
                    placeholder: "Component name...",
                    onInput: q
                  }, null, 40, Hf), [
                    [Ce, se.name]
                  ]),
                  c("div", Kf, [
                    O[10] || (O[10] = c("span", { class: "weight-label" }, "w:", -1)),
                    me(c("input", {
                      "onUpdate:modelValue": (L) => se.weight = L,
                      type: "number",
                      step: "0.05",
                      min: "0.1",
                      max: "3.0",
                      class: "weight-input",
                      onInput: q
                    }, null, 40, qf), [
                      [
                        Ce,
                        se.weight,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  c("button", {
                    class: "save-comp-btn",
                    title: "Save component as reusable preset in user library",
                    onClick: (L) => Q(se)
                  }, " 💾 ", 8, Gf),
                  c("button", {
                    class: "remove-btn",
                    title: "Remove",
                    onClick: (L) => K(G)
                  }, " × ", 8, Wf)
                ]),
                c("div", zf, [
                  c("div", Jf, [
                    O[11] || (O[11] = c("label", { class: "field-label" }, "Keywords / Tags:", -1)),
                    me(c("textarea", {
                      "onUpdate:modelValue": (L) => se.keywords = L,
                      class: "comp-textarea",
                      rows: "2",
                      placeholder: "Comma separated tags e.g. 1girl, silver hair, blue eyes...",
                      onInput: q
                    }, null, 40, Yf), [
                      [Ce, se.keywords]
                    ])
                  ]),
                  c("div", Xf, [
                    O[12] || (O[12] = c("label", { class: "field-label" }, "Natural Description (Flux / Photoreal):", -1)),
                    me(c("textarea", {
                      "onUpdate:modelValue": (L) => se.description = L,
                      class: "comp-textarea",
                      rows: "2",
                      placeholder: "Natural language descriptive sentence...",
                      onInput: q
                    }, null, 40, Zf), [
                      [Ce, se.description]
                    ])
                  ]),
                  (C = E.value) != null && C.supports_negative ? (x(), A("div", Qf, [
                    O[13] || (O[13] = c("label", { class: "field-label" }, "Negative keywords:", -1)),
                    me(c("input", {
                      "onUpdate:modelValue": (L) => se.negative = L,
                      class: "comp-input",
                      placeholder: "Component-specific negative tokens...",
                      onInput: q
                    }, null, 40, ed), [
                      [Ce, se.negative]
                    ])
                  ])) : oe("", !0)
                ])
              ]);
            }), 128))
          ]))
        ]),
        c("div", td, [
          c("div", sd, [
            O[14] || (O[14] = c("label", { class: "field-label" }, "Extra Global Positive:", -1)),
            me(c("input", {
              "onUpdate:modelValue": O[2] || (O[2] = (se) => n.value = se),
              class: "comp-input",
              placeholder: "Extra tags or text to append...",
              onInput: N
            }, null, 544), [
              [Ce, n.value]
            ])
          ]),
          (he = E.value) != null && he.supports_negative ? (x(), A("div", nd, [
            O[15] || (O[15] = c("label", { class: "field-label" }, "Extra Global Negative:", -1)),
            me(c("input", {
              "onUpdate:modelValue": O[3] || (O[3] = (se) => o.value = se),
              class: "comp-input",
              placeholder: "Extra negative tags to append...",
              onInput: N
            }, null, 544), [
              [Ce, o.value]
            ])
          ])) : oe("", !0)
        ]),
        c("div", od, [
          c("div", { class: "section-title-row" }, [
            O[16] || (O[16] = c("label", { class: "section-label" }, "Live Compiled Output", -1)),
            c("div", { class: "preview-actions" }, [
              c("button", {
                class: "primary-pill-btn",
                onClick: d
              }, "Refresh"),
              c("button", {
                class: "send-graph-btn",
                title: "Update existing prompt nodes or add new ones on canvas",
                onClick: Y
              }, " → Apply to Graph ")
            ])
          ]),
          c("div", id, [
            c("div", rd, [
              O[17] || (O[17] = c("span", { class: "output-badge pos" }, "Positive Prompt", -1)),
              c("button", {
                class: "copy-btn",
                onClick: O[4] || (O[4] = (se) => X(p.value, "Positive Prompt"))
              }, "Copy")
            ]),
            c("div", ld, H(p.value || "(Empty compiled prompt)"), 1)
          ]),
          (Te = E.value) != null && Te.supports_negative ? (x(), A("div", ad, [
            c("div", cd, [
              O[18] || (O[18] = c("span", { class: "output-badge neg" }, "Negative Prompt", -1)),
              c("button", {
                class: "copy-btn",
                onClick: O[5] || (O[5] = (se) => X(g.value, "Negative Prompt"))
              }, "Copy")
            ]),
            c("div", ud, H(g.value || "(Empty negative prompt)"), 1)
          ])) : oe("", !0),
          b.value.length > 0 ? (x(), A("div", fd, [
            O[19] || (O[19] = c("span", { class: "lora-header" }, "Detected LoRAs:", -1)),
            (x(!0), A(ye, null, je(b.value, (se, G) => (x(), A("span", {
              key: G,
              class: "lora-tag"
            }, H(se.name) + " (" + H(se.strength) + ") ", 1))), 128))
          ])) : oe("", !0)
        ]),
        i.value ? (x(), Tt($f, {
          key: 0,
          "initial-counts": I.value,
          onClose: O[6] || (O[6] = (se) => i.value = !1),
          onSelect: $e,
          onDeselect: Z
        }, null, 8, ["initial-counts"])) : oe("", !0)
      ]);
    };
  }
}), pd = /* @__PURE__ */ Wt(dd, [["__scopeId", "data-v-5de20a58"]]), hd = { class: "libretto-modal-content" }, gd = { class: "modal-header" }, vd = { class: "modal-body" }, md = { class: "form-group" }, yd = { class: "scope-toggle-group" }, bd = ["disabled"], _d = {
  key: 0,
  class: "graph-info-banner"
}, wd = {
  key: 0,
  class: "badge"
}, Cd = {
  key: 1,
  class: "badge"
}, xd = { class: "form-group checkbox-row" }, $d = { class: "checkbox-label" }, kd = { class: "form-group" }, Sd = { class: "form-group" }, Td = { class: "form-group" }, Ad = { class: "form-group" }, Ed = {
  key: 1,
  class: "error-banner"
}, Pd = { class: "modal-footer" }, Id = ["disabled"], Ld = ["disabled"], Od = {
  key: 0,
  class: "spinner"
}, Nd = /* @__PURE__ */ Ot({
  __name: "SaveCompositionModal",
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const s = t, n = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B("1.0.0"), r = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(null), d = /* @__PURE__ */ B("full"), u = /* @__PURE__ */ B(!0), p = /* @__PURE__ */ B(null), g = /* @__PURE__ */ B(null), b = Cs(() => d.value === "selected" ? g.value : p.value);
    function M(v) {
      let m = 0, _ = 0;
      for (const S of v)
        S.type === "LibrettoInput" && m++, S.type === "LibrettoOutput" && _++;
      return { inputCount: m, outputCount: _ };
    }
    function E(v) {
      d.value = v;
    }
    Nt(() => {
      try {
        const v = rr();
        if (v && Array.isArray(v.nodes)) {
          const _ = M(v.nodes);
          p.value = {
            nodeCount: v.nodes.length,
            inputCount: _.inputCount,
            outputCount: _.outputCount,
            data: v
          };
        }
        const m = Lc();
        if (m && Array.isArray(m.nodes) && m.nodes.length > 0) {
          const _ = M(m.nodes);
          g.value = {
            nodeCount: m.nodes.length,
            inputCount: _.inputCount,
            outputCount: _.outputCount,
            data: m
          }, d.value = "selected";
        }
      } catch (v) {
        a.value = `Unable to extract active graph: ${v.message}`;
      }
    });
    async function I() {
      var m;
      if (!n.value.trim()) {
        a.value = "Title is required.";
        return;
      }
      const v = (m = b.value) == null ? void 0 : m.data;
      if (!v) {
        a.value = "No workflow data available to save.";
        return;
      }
      r.value = !0, a.value = null;
      try {
        const _ = i.value.split(",").map((j) => j.trim().toLowerCase()).filter(Boolean);
        d.value === "selected" && _.push("subgraph");
        const K = (await qa({
          title: n.value.trim(),
          summary: o.value.trim(),
          tags: _,
          version: l.value.trim() || "1.0.0",
          workflow: {
            format: "comfyui-json",
            data: v
          }
        })).entry.id;
        if (u.value)
          try {
            const j = Oc();
            j && await za(K, j);
          } catch (j) {
            console.warn("Could not attach canvas preview screenshot:", j);
          }
        s("saved", K);
      } catch (_) {
        a.value = _.message || "Failed to save composition.";
      } finally {
        r.value = !1;
      }
    }
    return (v, m) => {
      var _, S;
      return x(), A("div", {
        class: "libretto-modal-backdrop",
        onClick: m[9] || (m[9] = De((K) => v.$emit("close"), ["self"]))
      }, [
        c("div", hd, [
          c("div", gd, [
            m[10] || (m[10] = c("h4", null, "Save Active Graph as Libretto", -1)),
            c("button", {
              class: "modal-close-btn",
              onClick: m[0] || (m[0] = (K) => v.$emit("close"))
            }, "×")
          ]),
          c("div", vd, [
            c("div", md, [
              m[11] || (m[11] = c("label", null, "Composition Scope", -1)),
              c("div", yd, [
                c("button", {
                  type: "button",
                  class: Pe(["scope-btn", { active: d.value === "full" }]),
                  onClick: m[1] || (m[1] = (K) => E("full"))
                }, " Full Graph (" + H(((_ = p.value) == null ? void 0 : _.nodeCount) || 0) + " nodes) ", 3),
                c("button", {
                  type: "button",
                  class: Pe(["scope-btn", { active: d.value === "selected" }]),
                  disabled: !g.value || g.value.nodeCount === 0,
                  onClick: m[2] || (m[2] = (K) => E("selected"))
                }, " Selected Subgraph (" + H(((S = g.value) == null ? void 0 : S.nodeCount) || 0) + " nodes) ", 11, bd)
              ])
            ]),
            b.value ? (x(), A("div", _d, [
              c("span", null, [
                m[12] || (m[12] = Be("Target: ", -1)),
                c("strong", null, H(b.value.nodeCount) + " nodes", 1)
              ]),
              b.value.inputCount > 0 ? (x(), A("span", wd, H(b.value.inputCount) + " Inputs ", 1)) : oe("", !0),
              b.value.outputCount > 0 ? (x(), A("span", Cd, H(b.value.outputCount) + " Outputs ", 1)) : oe("", !0)
            ])) : oe("", !0),
            c("div", xd, [
              c("label", $d, [
                me(c("input", {
                  "onUpdate:modelValue": m[3] || (m[3] = (K) => u.value = K),
                  type: "checkbox"
                }, null, 512), [
                  [sr, u.value]
                ]),
                m[13] || (m[13] = c("span", null, "Capture canvas view as thumbnail preview", -1))
              ])
            ]),
            c("div", kd, [
              m[14] || (m[14] = c("label", null, "Composition Title *", -1)),
              me(c("input", {
                "onUpdate:modelValue": m[4] || (m[4] = (K) => n.value = K),
                type: "text",
                maxlength: "120",
                placeholder: "e.g. SDXL Refiner & Upscaler Pipeline",
                class: "libretto-input"
              }, null, 512), [
                [Ce, n.value]
              ])
            ]),
            c("div", Sd, [
              m[15] || (m[15] = c("label", null, "Summary / Notes", -1)),
              me(c("textarea", {
                "onUpdate:modelValue": m[5] || (m[5] = (K) => o.value = K),
                maxlength: "2000",
                rows: "3",
                placeholder: "Describe what this composition accomplishes and expected inputs...",
                class: "libretto-textarea"
              }, null, 512), [
                [Ce, o.value]
              ])
            ]),
            c("div", Td, [
              m[16] || (m[16] = c("label", null, "Tags (comma-separated)", -1)),
              me(c("input", {
                "onUpdate:modelValue": m[6] || (m[6] = (K) => i.value = K),
                type: "text",
                placeholder: "portrait, upscaler, ksampler",
                class: "libretto-input"
              }, null, 512), [
                [Ce, i.value]
              ])
            ]),
            c("div", Ad, [
              m[17] || (m[17] = c("label", null, "Semantic Version", -1)),
              me(c("input", {
                "onUpdate:modelValue": m[7] || (m[7] = (K) => l.value = K),
                type: "text",
                placeholder: "1.0.0",
                class: "libretto-input"
              }, null, 512), [
                [Ce, l.value]
              ])
            ]),
            a.value ? (x(), A("div", Ed, H(a.value), 1)) : oe("", !0)
          ]),
          c("div", Pd, [
            c("button", {
              class: "libretto-btn",
              disabled: r.value,
              onClick: m[8] || (m[8] = (K) => v.$emit("close"))
            }, " Cancel ", 8, Id),
            c("button", {
              class: "libretto-btn primary",
              disabled: r.value || !n.value.trim(),
              onClick: I
            }, [
              r.value ? (x(), A("span", Od)) : oe("", !0),
              Be(" " + H(r.value ? "Saving..." : "Save to Library"), 1)
            ], 8, Ld)
          ])
        ])
      ]);
    };
  }
}), Md = /* @__PURE__ */ Wt(Nd, [["__scopeId", "data-v-75481bba"]]), Rd = { class: "libretto-modal-content" }, Dd = { class: "modal-header" }, Fd = { class: "modal-body" }, Ud = {
  key: 1,
  class: "file-chosen-box"
}, jd = { class: "file-size" }, Vd = { class: "form-group" }, Bd = {
  key: 0,
  class: "preview-result-box"
}, Hd = { class: "preview-info" }, Kd = {
  key: 0,
  class: "warnings-box"
}, qd = {
  key: 1,
  class: "error-banner"
}, Gd = { class: "modal-footer" }, Wd = ["disabled"], zd = ["disabled"], Jd = {
  key: 0,
  class: "spinner"
}, Yd = /* @__PURE__ */ Ot({
  __name: "ImportExportModal",
  emits: ["close", "imported"],
  setup(e, { emit: t }) {
    const s = t, n = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(null), i = /* @__PURE__ */ B(null), l = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B("rename"), a = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(null);
    function u() {
      var I;
      (I = n.value) == null || I.click();
    }
    function p(I) {
      const v = I.target;
      v.files && v.files.length > 0 && b(v.files[0]);
    }
    function g(I) {
      I.dataTransfer && I.dataTransfer.files.length > 0 && b(I.dataTransfer.files[0]);
    }
    async function b(I) {
      o.value = I, d.value = null;
      try {
        const v = await I.text(), m = JSON.parse(v);
        i.value = m;
        const _ = await Uo(m, !0, r.value);
        l.value = _;
      } catch (v) {
        d.value = `File could not be parsed: ${v.message}`, i.value = null, l.value = null;
      }
    }
    async function M() {
      if (i.value) {
        a.value = !0, d.value = null;
        try {
          await Uo(i.value, !1, r.value), s("imported");
        } catch (I) {
          d.value = I.message || "Import failed.";
        } finally {
          a.value = !1;
        }
      }
    }
    function E(I) {
      return I < 1024 ? I + " B" : I < 1024 * 1024 ? (I / 1024).toFixed(1) + " KB" : (I / (1024 * 1024)).toFixed(1) + " MB";
    }
    return (I, v) => {
      var m, _, S, K, j;
      return x(), A("div", {
        class: "libretto-modal-backdrop",
        onClick: v[5] || (v[5] = De((q) => I.$emit("close"), ["self"]))
      }, [
        c("div", Rd, [
          c("div", Dd, [
            v[6] || (v[6] = c("h4", null, "Import Compositions", -1)),
            c("button", {
              class: "modal-close-btn",
              onClick: v[0] || (v[0] = (q) => I.$emit("close"))
            }, "×")
          ]),
          c("div", Fd, [
            v[13] || (v[13] = c("p", { class: "modal-desc" }, [
              Be(" Upload a Libretto package file ("),
              c("code", null, ".libretto.json"),
              Be(") or any standard ComfyUI workflow JSON to add it to your local library. ")
            ], -1)),
            c("div", {
              class: "drop-zone",
              onDragover: v[2] || (v[2] = De(() => {
              }, ["prevent"])),
              onDrop: De(g, ["prevent"])
            }, [
              c("input", {
                ref_key: "fileInputRef",
                ref: n,
                type: "file",
                accept: ".json,.libretto.json",
                class: "hidden-file-input",
                onChange: p
              }, null, 544),
              o.value ? (x(), A("div", Ud, [
                c("strong", null, H(o.value.name), 1),
                c("span", jd, H(E(o.value.size)), 1),
                c("button", {
                  class: "libretto-btn btn-sm",
                  onClick: v[1] || (v[1] = (q) => {
                    o.value = null, i.value = null, l.value = null;
                  })
                }, " Clear ")
              ])) : (x(), A("div", {
                key: 0,
                class: "drop-prompt",
                onClick: u
              }, [...v[7] || (v[7] = [
                c("span", { class: "upload-icon" }, "↓", -1),
                c("span", null, "Click to browse or drop JSON file here", -1)
              ])]))
            ], 32),
            c("div", Vd, [
              v[9] || (v[9] = c("label", null, "If composition already exists in library:", -1)),
              me(c("select", {
                "onUpdate:modelValue": v[3] || (v[3] = (q) => r.value = q),
                class: "libretto-select"
              }, [...v[8] || (v[8] = [
                c("option", { value: "rename" }, "Create a copy (Rename)", -1),
                c("option", { value: "overwrite" }, "Overwrite existing", -1),
                c("option", { value: "skip" }, "Skip if already present", -1)
              ])], 512), [
                [an, r.value]
              ])
            ]),
            l.value ? (x(), A("div", Bd, [
              v[12] || (v[12] = c("div", { class: "preview-title" }, "Validation Preview", -1)),
              c("div", Hd, [
                c("span", null, [
                  v[10] || (v[10] = Be("Title: ", -1)),
                  c("strong", null, H((m = l.value.entry_preview) == null ? void 0 : m.title), 1)
                ]),
                c("span", null, [
                  v[11] || (v[11] = Be("Nodes: ", -1)),
                  c("strong", null, H(((K = (S = (_ = l.value.entry_preview) == null ? void 0 : _.requirements) == null ? void 0 : S.node_classes) == null ? void 0 : K.length) || 0) + " required", 1)
                ])
              ]),
              (j = l.value.warnings) != null && j.length ? (x(), A("div", Kd, [
                (x(!0), A(ye, null, je(l.value.warnings, (q) => (x(), A("span", { key: q }, H(q), 1))), 128))
              ])) : oe("", !0)
            ])) : oe("", !0),
            d.value ? (x(), A("div", qd, H(d.value), 1)) : oe("", !0)
          ]),
          c("div", Gd, [
            c("button", {
              class: "libretto-btn",
              disabled: a.value,
              onClick: v[4] || (v[4] = (q) => I.$emit("close"))
            }, " Cancel ", 8, Wd),
            c("button", {
              class: "libretto-btn primary",
              disabled: a.value || !i.value,
              onClick: M
            }, [
              a.value ? (x(), A("span", Jd)) : oe("", !0),
              Be(" " + H(a.value ? "Importing..." : "Confirm Import"), 1)
            ], 8, zd)
          ])
        ])
      ]);
    };
  }
}), Xd = /* @__PURE__ */ Wt(Yd, [["__scopeId", "data-v-ccca153a"]]), Zd = { class: "libretto-modal-content" }, Qd = { class: "modal-header" }, ep = { class: "modal-body" }, tp = {
  key: 0,
  class: "libretto-state-box"
}, sp = {
  key: 1,
  class: "stats-container"
}, np = { class: "stat-item" }, op = { class: "stat-value font-mono" }, ip = { class: "stat-grid" }, rp = { class: "stat-card" }, lp = { class: "stat-num" }, ap = { class: "stat-card" }, cp = { class: "stat-num" }, up = { class: "stat-card" }, fp = { class: "stat-num" }, dp = { class: "tools-section" }, pp = { class: "tool-row" }, hp = ["disabled"], gp = { class: "tool-row" }, vp = ["href"], mp = { class: "modal-footer" }, yp = /* @__PURE__ */ Ot({
  __name: "SettingsModal",
  emits: ["close", "refreshed"],
  setup(e, { emit: t }) {
    const s = t, n = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(!0), i = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B("success");
    async function a() {
      o.value = !0;
      try {
        n.value = await Xa();
      } catch (p) {
        l.value = p.message || "Failed to load storage statistics.", r.value = "error";
      } finally {
        o.value = !1;
      }
    }
    async function d() {
      i.value = !0, l.value = null;
      try {
        await a(), l.value = "Manifest verified and synchronized successfully.", r.value = "success", s("refreshed");
      } catch (p) {
        l.value = p.message || "Rebuild failed.", r.value = "error";
      } finally {
        i.value = !1;
      }
    }
    function u(p) {
      return p < 1024 ? p + " B" : p < 1024 * 1024 ? (p / 1024).toFixed(1) + " KB" : (p / (1024 * 1024)).toFixed(1) + " MB";
    }
    return Nt(() => {
      a();
    }), (p, g) => (x(), A("div", {
      class: "libretto-modal-backdrop",
      onClick: g[2] || (g[2] = De((b) => p.$emit("close"), ["self"]))
    }, [
      c("div", Zd, [
        c("div", Qd, [
          g[3] || (g[3] = c("h4", null, "Libretto Settings & Storage", -1)),
          c("button", {
            class: "modal-close-btn",
            onClick: g[0] || (g[0] = (b) => p.$emit("close"))
          }, "×")
        ]),
        c("div", ep, [
          o.value ? (x(), A("div", tp, [...g[4] || (g[4] = [
            c("span", { class: "spinner" }, null, -1),
            Be(" Loading stats... ", -1)
          ])])) : n.value ? (x(), A("div", sp, [
            c("div", np, [
              g[5] || (g[5] = c("span", { class: "stat-label" }, "Storage Location:", -1)),
              c("span", op, H(n.value.root_dir), 1)
            ]),
            c("div", ip, [
              c("div", rp, [
                c("span", lp, H(n.value.total_entries), 1),
                g[6] || (g[6] = c("span", { class: "stat-sub" }, "Compositions", -1))
              ]),
              c("div", ap, [
                c("span", cp, H(n.value.total_backups), 1),
                g[7] || (g[7] = c("span", { class: "stat-sub" }, "Backups", -1))
              ]),
              c("div", up, [
                c("span", fp, H(u(n.value.disk_usage_bytes)), 1),
                g[8] || (g[8] = c("span", { class: "stat-sub" }, "Disk Usage", -1))
              ])
            ])
          ])) : oe("", !0),
          c("div", dp, [
            g[11] || (g[11] = c("h5", null, "Maintenance & Diagnostics", -1)),
            c("div", pp, [
              g[9] || (g[9] = c("div", null, [
                c("strong", null, "Rebuild Manifest Index"),
                c("p", { class: "tool-desc" }, "Scans all entry JSON files and synchronizes manifest.json.")
              ], -1)),
              c("button", {
                class: "libretto-btn btn-sm",
                disabled: i.value,
                onClick: d
              }, H(i.value ? "Rebuilding..." : "Rebuild"), 9, hp)
            ]),
            c("div", gp, [
              g[10] || (g[10] = c("div", null, [
                c("strong", null, "Export Library Bundle"),
                c("p", { class: "tool-desc" }, "Download all library entries, manifests, and previews in a single ZIP.")
              ], -1)),
              c("a", {
                href: hs(Wa)(),
                download: "",
                class: "libretto-btn btn-sm"
              }, " Download ZIP ", 8, vp)
            ])
          ]),
          l.value ? (x(), A("div", {
            key: 2,
            class: Pe(["feedback-banner", r.value])
          }, H(l.value), 3)) : oe("", !0)
        ]),
        c("div", mp, [
          c("button", {
            class: "libretto-btn",
            onClick: g[1] || (g[1] = (b) => p.$emit("close"))
          }, "Close")
        ])
      ])
    ]));
  }
}), bp = /* @__PURE__ */ Wt(yp, [["__scopeId", "data-v-f947b55b"]]), _p = { class: "comfyui-libretto-container" }, wp = { class: "libretto-header" }, Cp = { class: "header-actions" }, xp = { class: "libretto-nav-tabs" }, $p = { class: "libretto-main" }, kp = /* @__PURE__ */ Ot({
  __name: "App",
  setup(e) {
    const t = /* @__PURE__ */ B("composer"), s = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(!1);
    async function r(g) {
      var b, M;
      try {
        const E = await or(g);
        if (!((M = (b = E.entry) == null ? void 0 : b.workflow) != null && M.data)) {
          alert("Composition contains no workflow data.");
          return;
        }
        lr(E.entry.workflow.data, "smart_apply");
      } catch (E) {
        alert(`Could not apply composition: ${E.message}`);
      }
    }
    function a(g) {
      o.value = !1, n.value = g, p();
    }
    function d() {
      i.value = !1, p();
    }
    function u() {
      n.value = null, p();
    }
    function p() {
      var g;
      (g = s.value) != null && g.refresh && s.value.refresh();
    }
    return (g, b) => (x(), A("div", _p, [
      c("header", wp, [
        c("div", {
          class: "brand-group",
          onClick: b[0] || (b[0] = (M) => n.value = null)
        }, [...b[11] || (b[11] = [
          c("span", { class: "libretto-icon" }, "¶", -1),
          c("span", { class: "brand-title" }, "Libretto", -1)
        ])]),
        c("div", Cp, [
          c("button", {
            class: "libretto-icon-btn",
            title: "Import Composition",
            onClick: b[1] || (b[1] = (M) => i.value = !0)
          }, " ↑ "),
          c("button", {
            class: "libretto-icon-btn",
            title: "Settings & Storage",
            onClick: b[2] || (b[2] = (M) => l.value = !0)
          }, " ⚙ ")
        ])
      ]),
      c("nav", xp, [
        c("button", {
          class: Pe(["tab-btn", { active: t.value === "composer" }]),
          onClick: b[3] || (b[3] = (M) => {
            t.value = "composer", n.value = null;
          })
        }, " Prompt Composer ", 2),
        c("button", {
          class: Pe(["tab-btn", { active: t.value === "library" }]),
          onClick: b[4] || (b[4] = (M) => t.value = "library")
        }, " Workflows & Library ", 2)
      ]),
      c("main", $p, [
        t.value === "composer" ? (x(), Tt(pd, { key: 0 })) : (x(), A(ye, { key: 1 }, [
          n.value ? (x(), Tt(bu, {
            key: 0,
            "entry-id": n.value,
            onBack: b[5] || (b[5] = (M) => n.value = null),
            onEntryDeleted: u
          }, null, 8, ["entry-id"])) : (x(), Tt(Pc, {
            key: 1,
            ref_key: "libraryRef",
            ref: s,
            onSelectEntry: b[6] || (b[6] = (M) => n.value = M),
            onQuickApply: r,
            onOpenSave: b[7] || (b[7] = (M) => o.value = !0)
          }, null, 512))
        ], 64))
      ]),
      o.value ? (x(), Tt(Md, {
        key: 0,
        onClose: b[8] || (b[8] = (M) => o.value = !1),
        onSaved: a
      })) : oe("", !0),
      i.value ? (x(), Tt(Xd, {
        key: 1,
        onClose: b[9] || (b[9] = (M) => i.value = !1),
        onImported: d
      })) : oe("", !0),
      l.value ? (x(), Tt(bp, {
        key: 2,
        onClose: b[10] || (b[10] = (M) => l.value = !1),
        onRefreshed: p
      })) : oe("", !0)
    ]));
  }
});
try {
  const e = new URL("./assets/style.css", import.meta.url).href;
  if (!document.querySelector(`link[href="${e}"]`)) {
    const t = document.createElement("link");
    t.rel = "stylesheet", t.href = e, document.head.appendChild(t);
  }
} catch (e) {
  console.warn("ComfyUI-Libretto: Could not auto-inject style.css", e);
}
let _t = null;
function cr(e) {
  _t && (_t.unmount(), _t = null), e.innerHTML = "";
  const t = document.createElement("div");
  t.style.width = "100%", t.style.height = "100%", e.appendChild(t), _t = ja(kp), _t.mount(t);
}
function Sp() {
  _t && (_t.unmount(), _t = null);
}
function Tp() {
  const e = "libretto-fallback-drawer";
  if (document.getElementById(e)) return;
  const t = document.createElement("div");
  t.id = e, Object.assign(t.style, {
    position: "fixed",
    top: "40px",
    right: "0",
    width: "360px",
    height: "calc(100vh - 40px)",
    zIndex: "9999",
    background: "#1a1a1e",
    boxShadow: "-4px 0 16px rgba(0,0,0,0.5)",
    display: "none",
    flexDirection: "column",
    transition: "transform 0.2s ease-in-out"
  });
  const s = document.createElement("button");
  s.innerText = "Libretto", Object.assign(s.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "10000",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)"
  });
  let n = !1;
  s.onclick = () => {
    n = !n, t.style.display = n ? "flex" : "none", n && !_t && cr(t);
  }, document.body.appendChild(t), document.body.appendChild(s);
}
Es.registerExtension({
  name: "ComfyUI.Libretto",
  async setup() {
    Es.extensionManager && typeof Es.extensionManager.registerSidebarTab == "function" ? Es.extensionManager.registerSidebarTab({
      id: "comfyui-libretto",
      icon: "pi pi-bookmark",
      title: "Libretto",
      tooltip: "ComfyUI-Libretto Compositions",
      type: "custom",
      render: (e) => {
        cr(e);
      },
      destroy: () => {
        Sp();
      }
    }) : Tp();
  }
});
