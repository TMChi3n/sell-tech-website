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

export const getAllOrders = async (token) => {
  try {
    const res = await url.get("/order", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching orders", err);
    throw err;
  }
};

export const updateOrderStatus = async (id_order, status, token) => {
  try {
    await url.patch(
      `/order/${id_order}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(`id order: ${id_order}`);
  } catch (err) {
    console.error("Error updating order status", err);
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

export const getUserById = async (id, token) => {
  try {
    const res = await url.get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err;
  }
};

export const resetPassword = async (token, resetPasswordData) => {
  try {
    const res = await url.post(
      `/auth/reset-password?token=${token}`,
      resetPasswordData
    );
    return res.data;
  } catch (err) {
    console.error("Error resetting password:", err);
    throw err;
  }
};

export const loginAccount = async (data) => {
  try {
    const res = await url.post("/auth/login", data);
    console.log("API response data:", res.data);
    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
