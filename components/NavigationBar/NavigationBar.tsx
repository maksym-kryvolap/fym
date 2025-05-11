import Image from "next/image";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logoFYM from "../../assets/logogDark.png";
import { Offcanvas } from "react-bootstrap";
import Link from "next/link"

export const NavigationBar = () => {
  const expand = "md";

  return (
    <Navbar
      expand="md"
      className="bg-body-tertiary shadow-sm rounded-bottom-3 navigation py-0"
      style={{
        zIndex: 2,
      }}
    >
      <Container className="py-0">
        <Link href="/">
          <Image src={logoFYM} alt="FYM logo" height={40} priority />
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Nav className="ms-auto d-none d-md-flex">
          <Link className="text-light text-decoration-none me-4" href="/">
            Home
          </Link>

          <Link className="text-light text-decoration-none" href="/favorites">
            Favorites
          </Link>
        </Nav>

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
          className="d-flex d-md-none navigation__mobile"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              <Image src={logoFYM} alt="FYM logo" height={50} priority />
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Link className="text-light text-decoration-none fs-4" href="/">
                Home
              </Link>

              <Link className="text-light text-decoration-none fs-4 mt-3" href="/favorites">
                Favorites
              </Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
