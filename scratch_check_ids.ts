import { getCollection } from 'astro:content';

async function checkIds() {
  const blogs = await getCollection('blog');
  console.log(
    'Blog IDs:',
    blogs.map(b => b.id)
  );

  const insights = await getCollection('insights');
  console.log(
    'Insights IDs:',
    insights.map(i => i.id)
  );
}

checkIds();
