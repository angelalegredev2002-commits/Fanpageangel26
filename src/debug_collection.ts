import { getCollection } from 'astro:content';

export async function debugCollection() {
  const allProducts = await getCollection('products');
  console.log(
    'All product IDs:',
    allProducts.map(p => p.id)
  );

  const esProducts = allProducts.filter(p => p.id.startsWith('es/'));
  console.log(
    'ES product IDs:',
    esProducts.map(p => p.id)
  );
}
