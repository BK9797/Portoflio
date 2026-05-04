let portfolioCache;

export const getPortfolio = async () => {
  if (portfolioCache) {
    return portfolioCache;
  }

  const response = await fetch(`${import.meta.env.BASE_URL}data/portfolio.json`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load portfolio data");
  }

  portfolioCache = await response.json();
  return portfolioCache;
};
