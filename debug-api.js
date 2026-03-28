/**
 * TESTE: Verificar se a API está retornando dados corretos com imagens
 * Executar com: node debug-api.js
 */

async function testCoinGeckoAPI() {
  console.log('🔍 Testando CoinGecko API...\n');

  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '3',
      sparkline: 'false',
    });

    const url = `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`;
    console.log(`📡 URL: ${url}\n`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log(`📊 Status: ${response.status}\n`);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ Resposta da API:\n');
    data.forEach((coin, index) => {
      console.log(`${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()})`);
      console.log(`   ID: ${coin.id}`);
      console.log(`   Image type: ${typeof coin.image}`);
      console.log(`   Image value: ${JSON.stringify(coin.image, null, 2)}`);
      console.log(`   Preço: $${coin.current_price}`);
      console.log(`   Mudança 24h: ${coin.price_change_percentage_24h}%\n`);
    });

    // Teste de transformação
    console.log('🔄 Teste de transformação:\n');
    const transformed = data.map((coin) => {
      let imageUrl = '';
      if (typeof coin.image === 'string') {
        imageUrl = coin.image;
        console.log(`✅ ${coin.symbol}: string → ${imageUrl}`);
      } else if (coin.image && typeof coin.image === 'object') {
        imageUrl = coin.image.small || coin.image.large || coin.image.thumb || '';
        console.log(`✅ ${coin.symbol}: object → ${imageUrl}`);
      } else {
        console.log(`❌ ${coin.symbol}: formato desconhecido`);
      }
      return { symbol: coin.symbol, image: imageUrl };
    });

    console.log('\n📋 Resultado final:\n');
    transformed.forEach((item) => {
      console.log(`${item.symbol}: ${item.image}`);
    });
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testCoinGeckoAPI();
