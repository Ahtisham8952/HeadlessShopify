import { gql } from "@/utils/gql";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  Image,
  Link,
  Text,
  Grid,
} from "@chakra-ui/react";
import NextLink from "next/link";

const getProducts = async () => {
  const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL;
  const ADMIN_API_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_ACCESS_TOKEN;

  if (!GRAPHQL_API_URL || !ADMIN_API_ACCESS_TOKEN) {
    throw new Error(
      "Missing environment variables for GraphQL API URL or Admin API Access Token"
    );
  }

  const res = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_API_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: gql`
        {
          collections(first: 3) {
            edges {
              node {
                id
                title
                products(first: 3) {
                  edges {
                    node {
                      id
                      title
                      variants(first: 1) {
                        edges {
                          node {
                            selectedOptions {
                              name
                              value
                            }
                          }
                        }
                      }
                      featuredImage {
                        url
                        altText
                      }
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }),
  });

  return res.json();
};

const HomePage = async () => {
  try {
    const json = await getProducts();
    const collections = json.data.collections.edges;

    return (
      <Box mx="auto" p={5} bg="#010101">
        <Box maxW={"1420px"} w="100%" mx="auto" py="50px">
        <Tabs>
          <TabList p='16px 32px' mx={"auto"} justifyContent="space-between" borderBottom={"none"} bg="rgba(49, 17, 100, 0.75)" maxW={"650px"} borderRadius={"100px"}>
            {collections.map(({ node: collection }) => (
              <Tab  key={collection.id} p="14px 46px" bg="transparent" color="rgba(255, 255, 255, 0.65)" borderRadius={"50px"} _selected={{bg:'red',bg:'#FFFFFF',color:'#7D31EA'}}>{collection.title}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {collections.map(({ node: collection }) => (
              <TabPanel key={collection.id}>
                <Grid
                mb="30px"
                gap="24px"
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(5, 1fr)',
                  xl: 'repeat(5, 1fr)',
                }}
                w="100%" 
                >
                  {collection.products.edges.map(({ node: product }) => (
                    <Box
                    bg="#FFFFFFED"
                    py="12px"
                      key={product.id}
                      border="1px"
                      borderColor="gray.200"
                      rounded="md"
                      overflow="hidden"
                      colSpan={{ base: 12, md: 6, lg: 4 }}
                    >
                      <Image
                      mx={"auto"}
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || "Product Image"}
                        width={200}
                        height={200}
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/500"
                      />
                      <Box p={5}>
                        <Heading size="lg" mb={3}>
                          {product.title}
                        </Heading>
                        {product.variants.edges[0].node.selectedOptions.map(
                          (option) => (
                            <Text key={option.name}>
                              {option.name}: {option.value}
                            </Text>
                          )
                        )}
                       
                          <Link
                          href={`/product/${product.handle}`} passHref
                            mt={3}
                            display="inline-block"
                            p={2}
                            borderWidth="1px"
                            borderColor="blue.600"
                            rounded="md"
                            color="blue.600"
                            _hover={{
                              bg: "blue.600",
                              color: "white",
                              transition: "all 0.2s",
                            }}
                          >
                            View Product
                          </Link>
                     
                      </Box>
                    </Box>
                  ))}
                </Grid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
        </Box>
        
      </Box>
    );
  } catch (error) {
    return (
      <Box as="main" p={5}>
        <Heading>Error Fetching Products</Heading>
      </Box>
    );
  }
};

export default HomePage;
