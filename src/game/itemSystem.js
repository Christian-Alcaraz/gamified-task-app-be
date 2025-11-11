const weightedItemLevel = (userLevel, minLevel, maxLevel, sigma = 3, samples = 1) => {
  const levels = [];
  const weights = [];

  for (let lvl = minLevel; lvl <= maxLevel; lvl++) {
    levels.push(lvl);
    const weight = Math.exp(-0.5 * Math.pow((lvl - userLevel) / sigma, 2));
    weights.push(weight);
  }

  console.log(JSON.stringify({ weights, levels }));

  const total = weights.reduce((a, b) => a + b, 0);
  const normalized = weights.map((w) => w / total);

  function sampleOne() {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < normalized.length; i++) {
      acc += normalized[i];
      if (r <= acc) return levels[i];
    }
    return levels[levels.length - 1];
  }

  if (samples === 1) return sampleOne();
  return Array.from({ length: samples }, sampleOne);
};
