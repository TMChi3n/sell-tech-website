import url from "../utils/baseUrl";

export const getAllProducts = async () => {
  try {
    const res = await url.get("/product/get");
    return res.data;
  } catch (err) {
    console.error("Error fetching products", err);
    throw err;
  }
};

export const createProduct = async (product) => {
  try {
    const res = await url.post('/product/create', product);
    return res.data;
  } catch (err) {
    console.error('Verify your data, please!', err);
    throw err;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const res = await url.put(`/product/update/${id}`, product); // Changed from GET to PUT
    return res.data;
  } catch (err) {
    console.error("Verify your data, please!", err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await url.delete(`/product/delete/${id}`); // Changed from GET to DELETE
    return res.data;
  } catch (err) {
    console.error("Error deleting product", err);
    throw err;
  }
};
