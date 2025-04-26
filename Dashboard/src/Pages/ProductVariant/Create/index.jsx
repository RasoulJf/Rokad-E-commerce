import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateProductVariant = () => {
  // Basic fields for product variant
  const [fields, handleChange] = useFormFields({
    price: "",
    discount: "0",
    quantity: "",
    productId: "",
    variantId: "",
  });
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Lists of products and variants for selection
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products and variants on mount
  useEffect(() => {
    (async () => {
      try {
        const prodResponse = await fetchData("product", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (prodResponse.success) {
          setProducts(prodResponse.data);
        }
        const varResponse = await fetchData("variant", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (varResponse.success) {
          setVariants(varResponse.data);
        }
      } catch (err) {
        notify("Error fetching products or variants", "error");
      }
    })();
  }, [token]);

  // Calculate price after discount on the fly
  const computePriceAfterDiscount = () => {
    const price = Number(fields.price);
    const discount = Number(fields.discount);
    if (!isNaN(price) && !isNaN(discount)) {
      return (price - price * (discount / 100)).toFixed(2);
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // You can either send the computed value or let the server calculate it.
      const payload = {
        ...fields,
        price: Number(fields.price),
        discount: Number(fields.discount),
        quantity: Number(fields.quantity),
        // Optionally include priceAfterDiscount if you want to override the server calculation:
        priceAfterDiscount: Number(computePriceAfterDiscount()),
      };

      const response = await fetchData("product-variant", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify("Product variant created successfully", "success");
        navigate("/product-variant");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error creating product variant", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Product Variant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price *</label>
          <input
            type="number"
            name="price"
            value={fields.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Discount Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={fields.discount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter discount percentage"
            min="0"
            max="100"
          />
        </div>

        {/* Quantity Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={fields.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product *</label>
          <select
            name="productId"
            value={fields.productId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a product</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.title || prod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variant Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Variant *</label>
          <select
            name="variantId"
            value={fields.variantId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a variant</option>
            {variants.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.value}
              </option>
            ))}
          </select>
        </div>

        {/* Computed Price After Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price After Discount:
          </label>
          <p className="mt-1 text-lg font-semibold">
            {computePriceAfterDiscount() ? `$${computePriceAfterDiscount()}` : "-"}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Creating..." : "Create Product Variant"}
        </button>
      </form>
    </div>
  );
};

export default CreateProductVariant;
