import type { NextApiRequest, NextApiResponse } from 'next'



export default (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'GET') {

    const page = <number><unknown>req.query.page
    const rows = <number><unknown>req.query.rows

    let start = page > 1 ? ((page - 1) * rows) + 1 : 1
    let end = page * rows

    type JSONResponse = {
      userId: number,
      id: number,
      title: string,
      body: string
    }[]

    return new Promise<void>((resolve, reject) => {

      fetch("https://jsonplaceholder.typicode.com/posts")
        .then(async response => {
          if (!response.ok) {
            res.json(response);
            res.status(405).end();
            resolve();
          }
          const comments: JSONResponse = await response.json()
          const totalRecords: number = comments.length

          let result: {
            userId: number,
            id: number,
            title: string,
            body: string
          }[] = comments.filter(comment => comment.id <= end && comment.id >= start)

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ comments: result, totalRecords: totalRecords }));
          resolve();

        })
        .catch((err) => {
          res.json(err)
          res.status(405).end();
          resolve();
        })
    });
  }

}
