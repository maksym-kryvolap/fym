import axios from "axios";
import { useState, useEffect } from "react";
import searchIcon from "../assets/searchIcon.png";
import favoritesIcon from "../assets/favoritesIcon.png";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import {
  IMovieDetails,
  removeFavoriteMovie,
  setFavoritesMovie,
} from "@/redux/slices/favorites.slice";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/redux/store/store";
import Head from "next/head";
import gsap from "gsap";
import { Layout } from "../components/layout";
import imbdIcon from "../assets/imbdIcon.png";
import { API_KEY } from "@/utils/constants"

const HomePage = () => {
  const [topSearch, setTopSearch] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [movieNotFound, setMovieNotFound] = useState(false);
  const [showMovieCard, setShowMovieCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [foundedMovie, setFoundedMovie] = useState<IMovieDetails | null>(null);
  const [show, setShow] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [movieInFavorites, setMovieInFavorites] = useState(false);

  const favoritsMovies = useSelector(
    ({ favoritesData }: IRootState) => favoritesData
  );

  const dispatch = useDispatch();

  useEffect(() => {
    gsap.fromTo(
      ".home__input",
      { y: 10, scale: 0.9, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.7, stagger: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (foundedMovie) {
      const isMovieInFavorites = favoritsMovies["All"].some(
        (movie) => movie.imdbID === foundedMovie.imdbID
      );

      setMovieInFavorites(isMovieInFavorites);
    }
  }, [foundedMovie, favoritsMovies]);

  const handleMovies = () => {
    setLoading(true);
    setMovieNotFound(false);

    const formattedMovieName = movieName.trim().split(" ").join("+");

    axios
      .get(`https://www.omdbapi.com/?t=${formattedMovieName}&apikey=${API_KEY}`)
      .then((response) => {
        if (response.data.Response === "False") {
          setTimeout(() => {
            setMovieNotFound(true);
            setLoading(false);
            setShowMovieCard(false);
          }, 1000);

          setTimeout(() => {
            setTopSearch(false);
            setFoundedMovie(null);
          }, 1500);

          return;
        }

        const {
          Actors,
          Poster,
          Title,
          Country,
          Genre,
          Language,
          Year,
          Runtime,
          Type,
          Writer,
          imdbRating,
          imdbID,
          Plot,
        } = response.data;

        const movieDetails = {
          Actors,
          Poster,
          Title,
          Country,
          Genre,
          Language,
          Year,
          Runtime,
          Type: Type.charAt(0).toUpperCase() + Type.slice(1).toLowerCase(),
          Writer,
          imdbRating,
          imdbID,
          Plot,
          AddedAt: new Date().toISOString(),
        };

        setTimeout(() => {
          setTopSearch(true);
          setFoundedMovie(movieDetails);
        }, 1000);

        setTimeout(() => {
          setShowMovieCard(true);
        }, 1500);
      })
      .catch(() => {
        setTimeout(() => {
          setTopSearch(false);
          setFoundedMovie(null);
          setMovieNotFound(true);
        }, 1500);

        setTimeout(() => {
          setShowMovieCard(false);
        }, 1000);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setMovieName("");
        }, 1000);
      });
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleAddToFavorites = (e: React.MouseEvent) => {
    const heartElement = document.createElement("div");
    heartElement.innerHTML = "❤️";
    heartElement.style.position = "absolute";
    heartElement.style.fontSize = "2rem";
    heartElement.style.pointerEvents = "none";

    const buttonRect = (e.target as HTMLElement).getBoundingClientRect();
    heartElement.style.left = `${buttonRect.left + window.scrollX}px`;
    heartElement.style.top = `${buttonRect.top + window.scrollY}px`;

    document.body.appendChild(heartElement);

    gsap.to(heartElement, {
      duration: 2,
      x: 0,
      y: -100,
      scale: 0.5,
      opacity: 0,
      ease: "power4.out",
      onComplete: () => {
        heartElement.remove();
      },
    });

    const isMovieInFavorites = favoritsMovies["All"].some(
      (movie) => movie.imdbID === foundedMovie?.imdbID
    );

    if (isMovieInFavorites && foundedMovie) {
      dispatch(removeFavoriteMovie(foundedMovie.imdbID));
      return;
    }

    foundedMovie && dispatch(setFavoritesMovie(foundedMovie));

    setIsClicked(true);

    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>FYM - Find you movie</title>
        <meta
          name="description"
          content="Find and discover your favorite movies with ease."
        />
      </Head>

      <Layout>
        <div
          className="position-relative w-100 d-flex flex-column align-items-center home"
          style={{
            transform: topSearch ? "translateY(0)" : "translateY(40%)",
          }}
        >
          <div className="home__input d-flex justify-content-between px-1 py-4 my-0 mx-auto">
            <div className="home__input-container">
              <input
                type="text"
                className="home__input-field px-3 w-100"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                placeholder="Search for a movie..."
              />

              <p
                className="fw-bold w-100 ms-2 mt-1 text-center"
                style={{
                  opacity: movieNotFound ? 1 : 0,
                  transition: "opacity 0.5s ease",
                  fontSize: "12px",
                  color: "rgb(155, 200, 236)",
                }}
              >
                No movie matches your search
              </p>
            </div>

            <button
              className="home__input-button ms-4 d-flex align-items-center justify-content-center"
              onClick={handleMovies}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div
                  className="spinner-border"
                  style={{
                    width: "16px",
                    height: "16px",
                    borderWidth: "2px",
                  }}
                  role="status"
                />
              ) : (
                <Image
                  src={searchIcon}
                  alt="searchIcon"
                  style={{
                    height: "16px",
                    width: "16px",
                  }}
                />
              )}
            </button>
          </div>

          {foundedMovie && (
            <div
              className="row w-100 d-flex justify-content-center movie mb-4"
              style={{
                opacity: showMovieCard ? "1" : "0",
              }}
            >
              <div className="col-12 col-lg-10 col-xl-8 pb-4 pt-5 py-md-4 m-0 movie__card position-relative">
                <button
                  className={`position-absolute d-flex justify-content-center align-items-center movie__card-favorites ${
                    isClicked ? "active" : ""
                  }`}
                  style={{
                    background: movieInFavorites
                      ? "rgb(71, 158, 240)"
                      : "rgb(245, 244, 244)",
                  }}
                  onClick={handleAddToFavorites}
                >
                  <Image src={favoritesIcon} alt="favoritesIcon" height={16} />
                </button>

                <div className="row p-0 m-0">
                  <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                    <button
                      onClick={handleShow}
                      className="movie__card-btn position-relative"
                      type="button"
                    >
                      <Image
                        src={foundedMovie.Poster}
                        alt="moviePoster"
                        fill
                        style={{
                          borderRadius: "10px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        sizes="(max-width: 1600px) 100%"
                        priority
                      />
                    </button>

                    <p className="mt-3 mb-0 fs-6 fw-semibold text-center">
                      {foundedMovie.Title}
                    </p>
                  </div>

                  <div className="col-12 col-md-8 movie__card-info mt-3 mt-md-0 d-flex flex-column">
                    <div>
                      <span className="fw-semibold">Actors:</span>
                      <span className="ms-1">{foundedMovie.Actors}</span>
                    </div>

                    <div className="mb-1">
                      <span className="fw-semibold">Country:</span>
                      <span className="ms-1">{foundedMovie.Country}</span>
                    </div>

                    <div className="mb-1">
                      <span className="fw-semibold">Genre:</span>
                      <span className="ms-1">{foundedMovie.Genre}</span>
                    </div>

                    <div className="mb-1">
                      <span className="fw-semibold">Language:</span>
                      <span className="ms-1">{foundedMovie.Language}</span>
                    </div>

                    <div className="mb-1">
                      <span className="fw-semibold">Year:</span>
                      <span className="ms-1">{foundedMovie.Year}</span>
                    </div>

                    <div className="mb-1">
                      <span className="fw-semibold">Runtime:</span>
                      <span className="ms-1">{foundedMovie.Runtime}</span>
                    </div>

                    <div className="mb-1">
                      <span className="fw-semibold">Type:</span>
                      <span className="ms-1">{foundedMovie.Type}</span>
                    </div>

                    <div className="mb-1">
                      <span className="fw-semibold">Writer:</span>
                      <span className="ms-1">{foundedMovie.Writer}</span>
                    </div>

                    <div className="mb-1 d-flex align-items-center">
                      <Image
                        src={imbdIcon}
                        alt="imbdIcon"
                        height={20}
                        style={{
                          borderRadius: "5px",
                          border: "2px solid rgb(61, 61, 57)",
                        }}
                      />

                      <span className="ms-2 fw-bold">
                        {foundedMovie.imdbRating}
                      </span>
                    </div>

                    <div className="mb-1 mt-3">
                      <span className="ms-1">{foundedMovie.Plot}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Modal show={show} onHide={handleClose}>
                <Modal.Body className="p-1 text-center bg-transparent d-flex align-items-center">
                  <img
                    src={foundedMovie.Poster}
                    alt="moviePoster"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px",
                    }}
                  />
                </Modal.Body>
              </Modal>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
