import { FormEvent, useRef, useState } from "react";
import styles from "./Modal.module.css";
import axios from "axios";

interface ModalProps {
  closeModal: () => void;
}

export default function Modal({ closeModal }: ModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  async function hanldeOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: nameRef.current?.value,
      brand: brandRef.current?.value,
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

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              required
              ref={brandRef}
              id="brand"
              name="brand"
              type="text"
              className="form-control"
            />
          </div>

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
