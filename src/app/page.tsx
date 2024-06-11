import { gql } from "@/utils/gql";

type GraphQLResponse = {
  data: {
    products: {
      nodes: {
        title: string;
        description: string;
      }[];
    };
  };
  extensions: {
    cost: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
};

const getProducts = async (): Promise<GraphQLResponse> => {
  const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL!;
  const ADMIN_API_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_ACCESS_TOKEN!;





  const res = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_API_ACCESS_TOKEN
    },
    body: JSON.stringify({
      query: gql`
        query ProductsQuery {
          products(first: 20) {
            nodes {
              title
              description
            }
          }
        }
      `
    })
  });

 

  return res.json();
};

const HomePage = async () => {
  try {
    const json = await getProducts();

    return (
      <main>
        <h1>Shopify + Next.js 13!</h1>

        <ul>
          {json.data.products.nodes.map((product,index) => (
            <>
          
            <li key={index}> {product.title}</li>
            <li>{product.description}</li>
            </>
          ))}
        </ul>
      </main>
    );
  } catch (error) {
    return (
      <main>
        <h1>Error Fetching Products</h1>
       
      </main>
    );
  }
};

export default HomePage;
