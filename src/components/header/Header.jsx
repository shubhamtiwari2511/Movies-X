import { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // For Top View
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Handle Scroll
  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);
  // On search
  const openSerach = () => {
    setShowSearch(true);
    setMobileMenu(false);
  };
  // On Menu
  const openMobileMenu = () => {
    setShowSearch(false);
    setMobileMenu(true);
  };
  // Query Handler
  const serachQueryHandler = (e) => {
    console.log(e);
    if (query) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 500);
    }
    setQuery("");
  };
  // Navigation Handle
  const navHandler = (data) => {
    switch (data) {
      case "movie":
        navigate("/explore/movie");
        break;
      case "tv":
        navigate("/explore/tv");
        break;

      default:
        navigate("/");
        break;
    }
    setMobileMenu(false);
  };
  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo">
          <img src={logo} onClick={() => navHandler("home")} />
        </div>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => navHandler("movie")}>
            Movies
          </li>
          <li className="menuItem" onClick={() => navHandler("tv")}>
            TV Shows
          </li>
          <li className="menuItem">
            <HiOutlineSearch onClick={openSerach} />
          </li>
        </ul>

        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSerach} />
          {mobileMenu ? (
            <VscChromeClose
              onClick={() => {
                setMobileMenu(false);
              }}
            />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <form onSubmit={serachQueryHandler}>
                <input
                  type="text"
                  placeholder="Serch for Movie or TV Show"
                  name="query"
                  required
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
              <VscChromeClose
                onClick={() => {
                  setShowSearch(false);
                }}
              />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
