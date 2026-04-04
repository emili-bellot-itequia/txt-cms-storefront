import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Form, InputGroup, Button, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import NavMenu from './NavMenu';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, name, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const { count: favCount } = useFavorites();
  const { logoUrl, siteName } = useSiteSettings();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
    setSearch('');
  };

  return (
    <header className="storefront-header">
      {/* Top bar */}
      <div className="header-topbar">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">Envío gratis en pedidos &gt; €50</small>
            <div className="d-flex gap-3">
              {isAuthenticated ? (
                <NavDropdown title={<><FaUser size={13} className="me-1" />{name}</>} align="end" className="topbar-dropdown">
                  <NavDropdown.Item as={Link} to="/account">Mi cuenta</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/account/orders">Mis pedidos</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Link to="/login" className="topbar-link">Iniciar sesión</Link>
                  <Link to="/register" className="topbar-link">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main nav */}
      <Navbar expand="lg" className="header-main">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            {logoUrl
              ? <img src={logoUrl} alt={siteName} className="brand-logo" />
              : <><span className="brand-txt">TXT</span><span className="brand-cms"> Shop</span></>
            }
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav"><FaBars /></Navbar.Toggle>

          <Navbar.Collapse id="main-nav">
            <Form className="header-search mx-auto" onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Button variant="primary" type="submit"><FaSearch /></Button>
              </InputGroup>
            </Form>

            <Nav className="ms-auto align-items-center gap-2">
              {isAuthenticated && (
                <Link to="/favorites" className="cart-btn text-decoration-none">
                  <FaHeart size={20} />
                  {favCount > 0 && <Badge bg="danger" className="cart-badge">{favCount}</Badge>}
                </Link>
              )}
              <button className="cart-btn" onClick={openDrawer}>
                <FaShoppingCart size={20} />
                {itemCount > 0 && <Badge bg="danger" className="cart-badge">{itemCount}</Badge>}
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NavMenu />
    </header>
  );
};

export default Header;
