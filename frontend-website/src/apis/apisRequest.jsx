import url from "../utils/baseUrl";

// Correct way to export functions
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
    const res = await url.post("/product/create", product);
    return res.data;
  } catch (err) {
    console.error("Verify your data, please!", err);
    throw err;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const formData = new FormData();
    formData.append("id_product", product.id_product);
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("material", product.material);
    formData.append("overview", product.overview);
    formData.append("type", product.type);
    formData.append("person", product.person);

    // Ensure img_url is appended correctly if it's a File object
    if (product.img_url instanceof File) {
      formData.append("img_url", product.img_url);
    }

    const res = await url.put(`/product/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Verify your data, please!", err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await url.delete(`/product/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting product", err);
    throw err;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await url.get("/users"); // Ensure the URL is correct
    return response.data; // Ensure this matches the structure of your API response
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

