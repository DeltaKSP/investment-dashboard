/**
 * TESTE: Verificar o fluxo completo da API → Context
 */

async function fetchCoinGeckoData() {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '3',
      sparkline: 'false',
    });

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status ${response.status}`);
    }

    const data = await response.json();

    console.log('📡 Raw API Response (primeiro item):');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('\n');

    return data.map((coin) => {
      let imageUrl = '';
      if (typeof coin.image === 'string') {
        imageUrl = coin.image;
      } else if (coin.image && typeof coin.image === 'object') {
        imageUrl = coin.image.small || coin.image.large || coin.image.thumb || '';
      }

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: imageUrl,
        type: 'crypto',
        currentPrice: coin.current_price,
        change24h: coin.price_change_24h ?? 0,
        change24hPercent: coin.price_change_percentage_24h ?? 0,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar dados do CoinGecko:', error.message);
    return [];
  }
}

function generateMockPositions(assets) {
  return assets.slice(0, 3).map((asset, index) => {
    const averageCost = asset.currentPrice * (0.7 + Math.random() * 0.1);
    const quantity = [0.5, 2, 100][index];
    const currentValue = quantity * asset.currentPrice;
    const gainLoss = currentValue - quantity * averageCost;
    const gainLossPercent = (gainLoss / (quantity * averageCost)) * 100;

    return {
      id: `pos-${asset.id}`,
      assetId: asset.id,
      asset,
      quantity,
      averageCost,
      currentValue,
      gainLoss,
      gainLossPercent,
    };
  });
}

function calculatePortfolio(positions) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalInvested = positions.reduce(
    (sum, pos) => sum + pos.quantity * pos.averageCost,
    0
  );
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return {
    id: 'portfolio-1',
    userId: 'user-1',
    positions,
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    lastUpdated: new Date(),
  };
}

async function testFullFlow() {
  console.log('🔄 Testando fluxo completo: API → generateMockPositions → calculatePortfolio\n');

  const assets = await fetchCoinGeckoData();
  console.log('✅ Assets obtidos da API:');
  assets.forEach((a) => {
    console.log(`   ${a.symbol}: image="${a.image}"`);
  });
  console.log('\n');

  const positions = generateMockPositions(assets);
  console.log('✅ Posições geradas:');
  positions.forEach((p) => {
    console.log(`   ${p.asset.symbol}: asset.image="${p.asset.image}"`);
  });
  console.log('\n');

  const portfolio = calculatePortfolio(positions);
  console.log('✅ Portfólio calculado:');
  portfolio.positions.forEach((p) => {
    console.log(`   ${p.asset.symbol}: image="${p.asset.image}"`);
  });
}

testFullFlow();
