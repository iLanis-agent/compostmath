/* CompostMath engine - honest compost math: the pile runs on carbon to nitrogen, not enthusiasm. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CompostEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var TARGET = 28; // target C:N

  var MATERIALS = {
    scraps:   { name: 'Kitchen scraps',   cn: 15,  kind: 'green' },
    grass:    { name: 'Grass clippings',  cn: 17,  kind: 'green' },
    coffee:   { name: 'Coffee grounds',   cn: 20,  kind: 'green' },
    manure:   { name: 'Manure (aged)',    cn: 18,  kind: 'green' },
    leaves:   { name: 'Dry leaves',       cn: 60,  kind: 'brown' },
    straw:    { name: 'Straw',            cn: 80,  kind: 'brown' },
    cardboard:{ name: 'Shredded cardboard', cn: 170, kind: 'brown' },
    woodchip: { name: 'Wood chips',       cn: 400, kind: 'brown' }
  };

  /* Bucket-weighted average C:N. Buckets are honest: nobody weighs compost. */
  function mixCN(parts) {
    var sum = 0, total = 0;
    for (var i = 0; i < parts.length; i++) {
      var m = MATERIALS[parts[i].mat];
      if (!m) throw new Error('unknown material ' + parts[i].mat);
      sum += parts[i].buckets * m.cn;
      total += parts[i].buckets;
    }
    if (total === 0) return 0;
    return Math.round(sum / total * 10) / 10;
  }

  function totalBuckets(parts) {
    var t = 0;
    for (var i = 0; i < parts.length; i++) t += parts[i].buckets;
    return t;
  }

  /* Buckets of fixer material to pull the mix back to target.
     x = B*(C - T) / (T - M) - only solvable when fixer is on the other side of target. */
  function bucketsToFix(parts, fixerMat, target) {
    var T = target || TARGET;
    var C = mixCN(parts);
    var B = totalBuckets(parts);
    var M = MATERIALS[fixerMat].cn;
    if (Math.abs(C - T) < 1) return 0;
    var x = B * (C - T) / (T - M);
    if (x < 0) return -1; // wrong side: this material makes it worse
    return Math.ceil(x);
  }

  function verdict(cn) {
    if (cn === 0) return 'add materials';
    if (cn < 20) return 'too green - expect slime and ammonia smell; add browns';
    if (cn <= 32) return 'balanced - the pile will heat';
    if (cn <= 45) return 'workable but slow; a bucket of greens wakes it up';
    return 'too brown - it will sit there for a year; add greens';
  }

  /* Hot compost needs mass: 27 cu ft (3x3x3) to hold heat. */
  function pileCuFt(lenFt, widFt, htFt) { return lenFt * widFt * htFt; }
  function heatsUp(cuFt) { return cuFt >= 27; }

  /* Finished compost is 30-40% of what you piled. */
  function finishedCuFt(cuFt) { return Math.round(cuFt * 0.35 * 10) / 10; }

  /* Time: hot pile turned weekly vs cold pile left alone. */
  function weeksToDone(hot, turned) {
    if (hot && turned) return { min: 6, max: 8, note: 'hot pile, turned weekly' };
    if (hot) return { min: 10, max: 14, note: 'hot pile, never turned - slower but done' };
    return { min: 26, max: 52, note: 'cold pile - it finishes when it finishes' };
  }

  return {
    TARGET: TARGET,
    MATERIALS: MATERIALS,
    mixCN: mixCN,
    totalBuckets: totalBuckets,
    bucketsToFix: bucketsToFix,
    verdict: verdict,
    pileCuFt: pileCuFt,
    heatsUp: heatsUp,
    finishedCuFt: finishedCuFt,
    weeksToDone: weeksToDone
  };
});
