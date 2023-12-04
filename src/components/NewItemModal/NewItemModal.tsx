import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./NewItemModal.module.css";
import axios from "axios";

interface ModalProps {
  closeModal: () => void;
}

interface Brand {
  id: number;
  name: string;
}

export default function NewItemModal({ closeModal }: ModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLSelectElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ORIGIN}/brand`).then(({ data }) => {
      setBrands(data);
    });
  }, []);

  async function hanldeOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: nameRef.current?.value,
      brandId: +brandRef.current?.value!,
      model: modelRef.current?.value,
      color: colorRef.current?.value,
      price: priceRef.current?.value,
    };

    try {
      await axios.post(`${import.meta.env.VITE_ORIGIN}/item`, data);
      setLoading(false);
      closeModal();
    } catch (error) {
      alert("An error occured");
      console.log(error);
      closeModal();
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 style={{ paddingBottom: "12px" }}>Add new item</h2>
        <form onSubmit={hanldeOnSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item name</label>
            <input
              required
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              className="form-control"
            />
          </div>

          {brands ? (
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <select
                ref={brandRef}
                defaultValue={brands[0].id}
                id="brandId"
                className="form-control"
              >
                {brands.map((brand) => {
                  return (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <h3>Loading brands</h3>
          )}

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              required
              ref={modelRef}
              id="model"
              name="model"
              type="text"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              required
              ref={colorRef}
              id="color"
              name="color"
              type="text"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              step="any"
              required
              ref={priceRef}
              id="price"
              name="price"
              type="number"
              min={0}
              className="form-control"
            />
          </div>

          <div className={styles.btns}>
            <button
              disabled={loading}
              type="submit"
              className="btn btn-primary"
            >
              Add
            </button>
            <button
              disabled={loading}
              type="button"
              onClick={closeModal}
              className="btn btn-danger"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
