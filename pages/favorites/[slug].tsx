import { IRootState } from "@/redux/store/store";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import trashIcon from "../../assets/trashIcon.png";
import imbdIcon from "../../assets/imbdIcon.png";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/router";
import {
  IMovieDetails,
  removeFavoriteMovie,
} from "@/redux/slices/favorites.slice";
import Head from "next/head";
import { Layout } from "@/components/layout";
import { formattedDate } from "@/utils/functions";
import { API_KEY } from "@/utils/constants";

export default function FavoritesItem() {
  const [show, setShow] = useState(false);
  const [remove, setRemove] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const [foundedMovie, setFoundedMovie] = useState<IMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const favoritesList = useSelector(
    ({ favoritesData }: IRootState) => favoritesData
  );

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (router.query.slug) handleFindMovieById();
  }, [router.query.slug]);

  const handleFindMovieById = () => {
    setErrorData(false);

    axios
      .get(
        `https://www.omdbapi.com/?i=${router.query.slug}&plot=full&apikey=${API_KEY}`
      )
      .then((response) => {
        if (response.data.Response === "False") return;

        const movieInFavoritesList = favoritesList["All"].find(
          (movie) => movie.imdbID === response.data.imdbID
        );

        if (!movieInFavoritesList) return;

        const { AddedAt, Type } = movieInFavoritesList;

        const movieDetails = {
          ...response.data,
          AddedAt,
          Type,
        };

        setFoundedMovie(movieDetails);
      })
      .catch(() => setErrorData(true))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRemove = () => {
    setRemove(true);

    setTimeout(() => {
      foundedMovie && dispatch(removeFavoriteMovie(foundedMovie.imdbID));

      router.push("/favorites");
    }, 700);
  };

  return (
    <>
      <Head>
        <title>Movie Details - FYM | Find Your Movie</title>
        <meta
          name="description"
          content="Explore your favorite movies and discover new ones with ease on FYM."
        />
      </Head>

      <Layout>
        {loading ? (
          <div className="row w-100 m-0 p-0 justify-content-center align-items-start align-items-md-center">
            <div className="skeleton-card p-4 py-5 col-12 col-lg-10 col-xl-8 mt-4 mt-md-0">
              <div className="d-flex flex-column flex-md-row">
                <div className="skeleton-img mb-3 mb-md-0 mx-auto mx-md-start"></div>
                <div className="flex-grow-1 ms-md-4">
                  <div
                    className="skeleton-line mb-2"
                    style={{ width: "50%" }}
                  ></div>
                  <div
                    className="skeleton-line mb-2"
                    style={{ width: "80%" }}
                  ></div>
                  <div
                    className="skeleton-line mb-2"
                    style={{ width: "60%" }}
                  ></div>
                  <div
                    className="skeleton-line mb-2"
                    style={{ width: "70%" }}
                  ></div>
                  <div
                    className="skeleton-line mb-2"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : foundedMovie ? (
          <div className="row d-flex justify-content-center align-items-center movie m-0 mt-3 mb-4 px-0 w-100">
            <div
              className="col-12 col-lg-10 col-xl-8 pb-4 pt-5 py-md-5 m-0 movie__card position-relative"
              style={
                remove
                  ? {
                      opacity: 0,
                      transform: "scale(0.8)",
                      transition: "all 1s ease-in-out",
                    }
                  : {}
              }
            >
              <button
                className="position-absolute d-flex justify-content-center align-items-center movie__card-favorites"
                style={{
                  background: "rgb(238, 238, 236)",
                }}
                onClick={handleRemove}
              >
                <Image src={trashIcon} alt="favoritesIcon" height={16} />
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
                  <div className="mb-1">
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
                    <span className="fw-semibold">Added:</span>
                    <span className="ms-1">
                      {formattedDate(foundedMovie.AddedAt)}
                    </span>
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
            </div>
          </div>
        ) : errorData && !foundedMovie ? (
          <h5 className="text-danger text-center w-100 my-auto">
            Something went wrong. Please try again later.
          </h5>
        ) : (
          <h5 className="text-center text-primary w-100 my-auto">
            Looks like this movie isn't in your favorites list
          </h5>
        )}
      </Layout>
    </>
  );
}
