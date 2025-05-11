import { FC } from "react";

interface IFilterTogle {
  valueFirst: string;
  valueSecond: string;
  valueThird?: string;
  titleFirst: string;
  titleSecond: string;
  titleThird?: string;
  initialValue: string;
  handleSortBy: (value: string) => void;
}

export const FilterTogle: FC<IFilterTogle> = ({
  valueFirst,
  valueSecond,
  valueThird,
  titleFirst,
  titleSecond,
  titleThird,
  initialValue,
  handleSortBy,
}) => (
  <div
    className="d-flex align-items-center justify-content-around position-relative filter__togle"
    style={{
      width: valueThird ? "152px" : "102px",
    }}
  >
    <button
      className="border-0 text-dark fw-bold d-flex justify-content-center align-items-center filter__togle-btn"
      onClick={() => handleSortBy(valueFirst)}
    >
      {titleFirst}
    </button>

    <button
      className="border-0 text-dark fw-bold d-flex justify-content-center align-items-center filter__togle-btn"
      onClick={() => handleSortBy(valueSecond)}
    >
      {titleSecond}
    </button>

    {valueThird && (
      <button
        className="border-0 text-dark fw-bold d-flex justify-content-center align-items-center filter__togle-btn"
        onClick={() => handleSortBy(valueThird)}
      >
        {titleThird}
      </button>
    )}

    <div
      className="position-absolute filter__togle-togler"
      style={{
        left:
          initialValue === valueFirst
            ? "1.5px"
            : initialValue === valueSecond
            ? "49px"
            : "99px",
      }}
    ></div>
  </div>
);
