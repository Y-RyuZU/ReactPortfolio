// app/api/collections.ts などのサーバーコンポーネントでの使用
import { createDirectus, rest, readItems } from '@directus/sdk';

// 型定義（例）
interface Article {
    id: number;
    title: string;
    content: string;
    published_date: string;
}

async function getArticles() {
    const directus = createDirectus(process.env.DIRECTUS_URL!).with(rest());

    try {
        const articles = await directus.request(
            readItems('articles', {
                fields: ['id', 'title', 'content', 'published_date'],
                filter: {
                    status: {
                        _eq: 'published'
                    }
                }
            })
        );
        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}