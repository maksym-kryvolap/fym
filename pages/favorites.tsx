import { Layout } from "@/components/layout";
import { IMovieDetails } from "@/redux/slices/favorites.slice";
import { IRootState } from "@/redux/store/store";
import gsap from "gsap";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import filterIcon from "../assets/filterIcon.png";
import categoryIcon from "../assets/categoryIcon.png";
import { FilterTogle } from "@/components/filterTogle";

interface IFilteredBy {
  name: string;
  rating: string;
  addedAt: string;
  year: string;
}

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [filteredMovies, setFilteredMovies] = useState<IMovieDetails[]>([]);
  const [visibleCategoryList, setVisibleCategoryList] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [filteredBy, setFilteredBy] = useState<IFilteredBy>({
    name: "", // "asc" | "desc" | "none"
    rating: "", // "up" | "down" | "none"
    addedAt: "newest", // "newest" | "oldest"
    year: "", // "newest" | "oldest" | "none"
  });

  const favoritsMovies = useSelector(
    ({ favoritesData }: IRootState) => favoritesData
  );

  useEffect(() => {
    setFilteredMovies(favoritsMovies[selectedGenre]);

    gsap.fromTo(
      ".filter",
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 1, stagger: 0.1, delay: 0.7 }
    );

    setTimeout(() => {
      setLoading(false);
    }, 700);
  }, []);

  useEffect(() => {
    if (!loading && !!favoritsMovies[selectedGenre].length) {
      gsap.fromTo(
        ".favorites__item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
      );
    }
  }, [loading, selectedGenre]);

  const handleSortByGenre = (value: string) => {
    setSelectedGenre(value);

    setVisibleCategoryList(false);

    setFilteredMovies(favoritsMovies[value]);

    setFilteredBy({
      name: "",
      rating: "",
      addedAt: "newest",
      year: "",
    });
  };

  const handleSortByRating = (value: string) => {
    if (value === "") {
      handleSortByGenre(selectedGenre);
    } else {
      const sortedMovies = [...filteredMovies].sort((a, b) => {
        const ratingA = parseFloat(a.imdbRating) || 0;
        const ratingB = parseFloat(b.imdbRating) || 0;

        return value === "up" ? ratingB - ratingA : ratingA - ratingB;
      });

      setFilteredMovies(sortedMovies);
    }

    setFilteredBy({ name: "", rating: value, addedAt: "newest", year: "" });
  };

  const handleSortByName = (value: string) => {
    if (value === "") {
      handleSortByGenre(selectedGenre);
    } else {
      const sortedMovies = [...filteredMovies].sort((a, b) =>
        value === "asc"
          ? a.Title.localeCompare(b.Title)
          : b.Title.localeCompare(a.Title)
      );

      setFilteredMovies(sortedMovies);
    }

    setFilteredBy({ name: value, rating: "", addedAt: "newest", year: "" });
  };

  const handleSortByAddedAt = (value: string) => {
    const sortedMovies = [...filteredMovies].sort((a, b) => {
      const dateA = new Date(a.AddedAt).getTime();
      const dateB = new Date(b.AddedAt).getTime();

      return value === "oldest" ? dateA - dateB : dateB - dateA;
    });

    setFilteredMovies(sortedMovies);

    setFilteredBy({ name: "", rating: "", addedAt: value, year: "" });
  };

  const handleSortByYear = (value: string) => {
    if (value === "") {
      handleSortByGenre(selectedGenre);
    } else {
      const sortedMovies = [...filteredMovies].sort((a, b) => {
        const dateA = +a.Year;
        const dateB = +b.Year;

        return value === "oldest" ? dateA - dateB : dateB - dateA;
      });

      setFilteredMovies(sortedMovies);
    }

    setFilteredBy({ name: "", rating: "", addedAt: "newest", year: value });
  };

  return (
    <>
      <Head>
        <title>Favorites - FYM | Find Your Movie</title>
        <meta
          name="description"
          content="View and manage your list of favorite movies. Easily find what you love on FYM."
        />
        {/* <link rel="icon" href="/logo.webp" /> */}
      </Head>

      <Layout>
        <div
          className="d-flex flex-column w-100 p-0 m-0 mt-4"
          style={{
            height: "max-content",
          }}
        >
          <div className="row m-0 mb-4 px-0">
            {!!favoritsMovies[selectedGenre].length && (
              <div className="filter w-100 justify-content-end d-flex gap-3 mb-5 flex-grow-1">
                <div
                  className="position-relative filter__category"
                  onMouseEnter={() => {
                    setVisibleCategoryList(true);
                    setVisibleFilter(false);
                  }}
                  onMouseLeave={() => setVisibleCategoryList(false)}
                >
                  <button
                    className="filter__category-btn"
                    onClick={() => {
                      setVisibleCategoryList(!visibleCategoryList);
                      setVisibleFilter(false);
                    }}
                  >
                    <Image
                      src={categoryIcon}
                      alt="categoryIcon"
                      className="filter__category-btn-icon"
                    />
                  </button>

                  <div
                    className="position-absolute filter__category-container p-2 ps-3 rounded-4 d-flex flex-column align-items-start"
                    style={{
                      opacity: visibleCategoryList ? 1 : 0,
                      visibility: visibleCategoryList ? "visible" : "hidden",
                      transform: visibleCategoryList
                        ? "translateY(0)"
                        : "translateY(5px)",
                    }}
                  >
                    {Object.keys(favoritsMovies).map((genre) => (
                      <button
                        onClick={() => handleSortByGenre(genre)}
                        className="filter__category-name"
                        style={
                          selectedGenre === genre
                            ? {
                                color: "#479ef0",
                                fontWeight: "bold",
                                transform: "translateX(4px)",
                              }
                            : {}
                        }
                        key={genre}
                      >
                        {genre} ({favoritsMovies[genre].length})
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className="position-relative filter__sort"
                  onMouseEnter={() => {
                    setVisibleCategoryList(false);
                    setVisibleFilter(true);
                  }}
                  onMouseLeave={() => setVisibleFilter(false)}
                >
                  <button
                    className="filter__sort-btn"
                    onClick={() => {
                      setVisibleCategoryList(false);
                      setVisibleFilter(!visibleFilter);
                    }}
                  >
                    <Image
                      src={filterIcon}
                      alt="filterIcon"
                      className="filter__sort-btn-icon"
                    />
                  </button>

                  <div
                    className="position-absolute filter__sort-container p-2 pb-3 rounded-4 d-flex flex-column"
                    style={{
                      opacity: visibleFilter ? 1 : 0,
                      visibility: visibleFilter ? "visible" : "hidden",
                      transform: visibleFilter
                        ? "translateY(0)"
                        : "translateY(5px)",
                    }}
                  >
                    <p
                      className="m-0 fw-bold ps-2 text-start w-100 text-light"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Name:
                    </p>

                    <FilterTogle
                      titleFirst="Aa"
                      titleSecond="aA"
                      titleThird="none"
                      valueFirst="asc"
                      valueSecond="desc"
                      valueThird="none"
                      handleSortBy={handleSortByName}
                      initialValue={filteredBy.name}
                    />

                    <p
                      className="m-0 fw-bold mt-2 ps-2 text-start w-100 text-light"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Added At:
                    </p>

                    <FilterTogle
                      titleFirst="Newest"
                      titleSecond="Oldest"
                      valueFirst="newest"
                      valueSecond="oldest"
                      handleSortBy={handleSortByAddedAt}
                      initialValue={filteredBy.addedAt}
                    />

                    <p
                      className="m-0 fw-bold mt-2 ps-2 text-start w-100 text-light"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Ranking:
                    </p>

                    <FilterTogle
                      titleFirst="Up"
                      titleSecond="Down"
                      titleThird="none"
                      valueFirst="up"
                      valueSecond="down"
                      valueThird="none"
                      handleSortBy={handleSortByRating}
                      initialValue={filteredBy.rating}
                    />

                    <p
                      className="m-0 fw-bold mt-2 ps-2 text-start w-100 text-light"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      Year:
                    </p>

                    <FilterTogle
                      titleFirst="Newest"
                      titleSecond="Oldest"
                      titleThird="none"
                      valueFirst="newest"
                      valueSecond="oldest"
                      valueThird="none"
                      handleSortBy={handleSortByYear}
                      initialValue={filteredBy.year}
                    />
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xxl-2 m-0 p-1">
                <div className="card rounded-4 m-0 p-2 h-100 skeleton__favorites-card">
                  <div className="d-flex justify-content-center mx-auto position-relative favorites__card-img skeleton__favorites-img"></div>

                  <div className="skeleton__favorites-line skeleton__favorites-title mt-2 mx-auto"></div>
                </div>
              </div>
            ) : !!favoritsMovies[selectedGenre].length ? (
              filteredMovies.map((movie) => (
                <div
                  className="col-6 col-sm-6 col-md-4 col-lg-3 col-xxl-2 m-0 p-1 favorites__item"
                  key={movie.imdbID}
                >
                  <Link
                    href={`/favorites/${movie.imdbID}`}
                    className="card rounded-4 m-0 p-2 h-100 favorites__card text-decoration-none position-relative"
                  >
                    <div className="d-flex justify-content-center mx-auto position-relative favorites__card-img">
                      <Image
                        src={movie.Poster}
                        alt={movie.Title}
                        fill
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        sizes="(max-width: 1600px) 100%"
                        priority
                      />
                    </div>

                    <p className="favorites__card-title fw-bold mb-0 mt-2 mb-1">
                      {movie.Title}
                    </p>

                    <p className="favorites__card-text mb-1 mt-auto d-flex align-items-center justify-content-between">
                      <span>{movie.Genre.split(",")[0]}</span>
                      <span>{movie.Year}</span>
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col text-center">
                <h5
                  style={{
                    color: "rgb(155, 200, 236)",
                  }}
                >
                  No favorite movies found
                </h5>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Favorites;
