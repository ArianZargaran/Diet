const getTotalMacros = (macros, qtty, eq) => {
  // eq is used to calc the proporcional qtty
  const realQtty = eq ? eq * qtty : qtty;
  const total = (realQtty / 100);
  return {
    p: macros.p * total,
    ch: macros.ch * total,
    f: macros.f * total,
  };
};

export default (meal, foods) => {
  const defaultMacros = {p: 0, ch: 0, f: 0};

  return meal
    .map(m => ({...foods[m.food], qtty: m.qtty}))
    .reduce((acc, val) => {
      const macros = val.macros ? getTotalMacros(val.macros, val.qtty, val.eq) : defaultMacros;
      return {p: acc.p + macros.p, ch: acc.ch + macros.ch, f: acc.f + macros.f};
    }, defaultMacros);
};