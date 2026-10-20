export const truncate = (text: string, max: number) => {
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  // avoid cutting mid-word, unless the only space is very early
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
};
