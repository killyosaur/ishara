import {parseISO} from 'date-fns';

export default class PostService {
    public async getAll(page: Number = 0, limit: Number = 0): Promise<PostCollection> {
        const requestOptions = {
            method: 'GET'
        };

        const api = process.env.REACT_APP_API;

        const response = await fetch(`${api}/posts?limit=${limit}&offset=${page}`, requestOptions);

        const text = await response.text();
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return {
            nextPage: data.nextPage,
            prevPage: data.prevPage,
            total: data.total,
            posts: data.posts.map((p: any) => {
                return {
                    id: p.id,
                    title: p.title,
                    content: p.content,
                    author: {
                        firstName: p.author.firstName,
                        lastName: p.author.lastName,
                        username: p.author.username
                    },
                    publishedOn: parseISO(p.publishedOn),
                    modifiedOn: parseISO(p.modifiedOn)
                };
            })
        };
    }
}

export interface PostCollection {
    posts: Post[];
    nextPage: number;
    prevPage: number;
    total: number;
};

export interface Post {
    id: string;
    title: string;
    content: string;
    author: Author;
    publishedOn: Date;
    modifiedOn: Date;
};

export interface Author {
    firstName: string;
    lastName: string;
    username: string;
};