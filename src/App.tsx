import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import NewItemModal from "./components/NewItemModal/NewItemModal";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./components/Pagination/Pagination ";

interface Item {
  id: number;
  name: string;
  brand: { name: string };
  model: string;
  color: string;
  price: number;
}

type ChangedPrice =
  | {
      id: string;
      oldValue: number;
      newValue: string;
    }
  | undefined;

function App() {
  const [showModal, setShowModal] = useState(false);
  const [change, setChange] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [items, setItems] = useState<Item[] | null>(null);
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const page = +(searchParams.get("p") || 1);

  const changes = useMemo(getChanges, [change, items]);

  function getChanges() {
    if (!items) return [];
    const changes = inputRefs.current.reduce((prev, curr, i) => {
      const item = items.find((item) => item?.id.toString() === curr?.id);
      if (item && curr && curr.value !== item.price.toString()) {
        const changed = {
          id: curr.id,
          oldValue: items[i].price,
          newValue: curr.value,
        };
        return [...prev, changed];
      }

      return prev;
    }, [] as ChangedPrice[]);

    return changes;
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ORIGIN}/item/count`)
      .then((count) => {
        setCount(count.data);
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }, []);

  useEffect(() => {
    setChange((prev) => !prev);
    axios
      .get(`${import.meta.env.VITE_ORIGIN}/item?p=${page}`)
      .then(({ data }) => {
        setItems(data);
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }, [searchParams, refresh]);

  async function handleEditPrice() {
    await axios.patch(`${import.meta.env.VITE_ORIGIN}/item`, changes);
    setRefresh((prev) => !prev);
  }

  function renderItems() {
    if (!items) return <h3>Loading...</h3>;
    if (!items.length) return <h3>No items found</h3>;
    else
      return (
        <>
          <table>
            <thead>
              <tr>
                <th />
                {items.map((item) => (
                  <th key={item.id}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Brand</td>
                {items.map((item) => (
                  <td key={item.id}>{item.brand.name}</td>
                ))}
              </tr>
              <tr>
                <td>Model</td>
                {items.map((item) => (
                  <td key={item.id}>{item.model}</td>
                ))}
              </tr>
              <tr>
                <td>Color</td>
                {items.map((item) => (
                  <td key={item.id}>{item.color}</td>
                ))}
              </tr>
              <tr>
                <td>Price</td>
                {items.map((item, i) => (
                  <td key={item.id}>
                    <input
                      type="number"
                      step="any"
                      className={`form-control${
                        changes.some((v) => v?.id === item.id.toString())
                          ? " modified"
                          : ""
                      }`}
                      id={`${item.id}`}
                      defaultValue={item.price}
                      onChange={() => setChange((prev) => !prev)}
                      ref={(el) => (inputRefs.current[i] = el!)}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              padding: "10px 0",
              justifyContent: "center",
            }}
          >
            <button
              disabled={!changes.length}
              className="btn btn-primary"
              onClick={handleEditPrice}
            >
              Save
            </button>
          </div>
        </>
      );
  }

  return (
    <>
      <nav>
        <div className="container">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Add new item
          </button>
        </div>
      </nav>
      <main>
        <div className="container">
          <h1 style={{ margin: "20px 0" }}>Items</h1>
          {renderItems()}
          <br />
          <Pagination
            count={count}
            current={page}
            setParams={setSearchParams}
          />
        </div>
        {showModal
          ? createPortal(
              <NewItemModal closeModal={() => setShowModal(false)} />,
              document.getElementById("modal") as Element
            )
          : null}
      </main>
    </>
  );
}

export default App;
