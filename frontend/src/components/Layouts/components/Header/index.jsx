import { useLocation, useNavigate } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import MobMenu from '../MobMenu';
import { useDispatch, useSelector } from 'react-redux';
import { UserTooltip } from '~/components/clients/client';
import { Drawer } from 'antd';
import { ChevronDown } from 'lucide-react';
import { Dolciluxe, Cart, UserProfile } from '~/assets/icons';
import ListItems from '../ListItems';
import { logOutUser } from '~/redux/apiRequest';
import { persistor } from '~/redux/store';
import { getCart } from '~/api/apiCart';
import { createInstance } from '~/redux/interceptors';
import { loginSuccess } from '~/redux/authSlice';
import { updateCartItem } from '~/api/apiCart';
import { AddToCartContext } from '../../DefaultLayout';
import CartPopover from '../Cart/CartPopover';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [open, setOpen] = useState(false);
  const { list } = useSelector((state) => state.cart);
  const [originalList, setOriginalList] = useState([]);
  const { setIsLogout } = useContext(AddToCartContext);

  let instance = createInstance(user, dispatch, loginSuccess);

  const viewCart = async () => {
    setOpen(true);
  };

  const onClose = async () => {
    if (list.length > 0) {
      try {
        const itemsToUpdate = list.filter((item, index) => item?.buy_quantity !== originalList[index].buy_quantity);
        if (itemsToUpdate.length > 0) {
          await Promise.all(itemsToUpdate.map((item) => updateCartItem(user.access_token, instance, item)));
        }
        setOpen(false);
      } catch (err) {
        console.error('Failed to update cart items', err);
      }
    } else setOpen(false);
  };
  const handleLogin = () => {
    navigate('/auth?mode=signin');
  };
  const handleLogOut = () => {
    if (user?.refresh_token) logOutUser(dispatch, user?.refresh_token, navigate);
    else {
      const refresh_token = localStorage.getItem('refreshToken');
      logOutUser(dispatch, refresh_token, navigate);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
    // dispatch(resetCart([]));
    persistor.purge();
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const res = await getCart(instance);
        if (res) {
          // dispatch(setCart(res?.data.items));
          setOriginalList(res?.data.items);
        }
      }
    };
    fetchCart(user, instance);
  }, [user, open]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  const urls = ['/category', '/birthday', '/tradition', '/cookie', '/bread'];
  return (
    <header className="fixed top-0 z-[100] h-16 w-full bg-fifth">
      <div className="mx-10 flex h-full items-center justify-between gap-4 text-primary lg:mx-20">
        <Link to="/">
          <Dolciluxe className="mt-2" />
        </Link>
        <ul className="hidden gap-12 px-4 text-base uppercase lg:flex">
          <li className={pathname === '/' ? 'menu-active' : 'menu-navbar'}>
            <NavLink to="/">TRANG CHỦ</NavLink>
          </li>
          <li className={urls.includes(pathname) ? 'menu-active group' : 'menu-navbar group'}>
            <NavLink to="/category" className="relative">
              <span>MENU BÁNH</span>
              <i>
                <ChevronDown className="icon mx-0.5 inline-block size-5" />
              </i>
            </NavLink>

            <div className="absolute left-0 top-full h-4 w-full cursor-default bg-transparent"></div>
            <ul className="absolute left-0 top-10 z-10 hidden w-max rounded-lg bg-[#CAB6B6] text-sm uppercase group-hover:block">
              <NavLink to="/category?mode=birthday">
                <li className="px-2 py-2 text-[#444444] hover:rounded-t-lg hover:bg-primary hover:text-slate-100">
                  Bánh Sinh Nhật
                </li>
              </NavLink>
              <NavLink to="/category?mode=tradition">
                <li className="px-2 py-2 text-[#444444] hover:bg-primary hover:text-slate-100">Bánh Truyền Thống</li>
              </NavLink>
              <NavLink to="/category?mode=cookie">
                <li className="px-2 py-2 text-[#444444] hover:bg-primary hover:text-slate-100">Cookie & Mini cake</li>
              </NavLink>
              <NavLink to="/category?mode=bread">
                <li className="px-2 py-2 text-[#444444] hover:rounded-b-lg hover:bg-primary hover:text-slate-100">
                  Bánh Mì và Bánh mặn
                </li>
              </NavLink>
            </ul>
          </li>
          <li className={pathname === '/news' ? 'menu-active' : 'menu-navbar'}>
            <NavLink to="/news">TIN TỨC</NavLink>
          </li>
          <li className={pathname === '/design' ? 'menu-active' : 'menu-navbar'}>
            <NavLink to="/design">THIẾT KẾ</NavLink>
          </li>
          <li className={pathname === '/generator' ? 'menu-active' : 'menu-navbar'}>
            <NavLink to="/generator">TẠO NHANH</NavLink>
          </li>
          <li className={pathname === '/about' ? 'menu-active' : 'menu-navbar'}>
            <NavLink to="/about">VỀ CHÚNG TÔI</NavLink>
          </li>
        </ul>

        <div className="flex gap-12">
          {/* Cart Logo */}
          <CartPopover />
          {/* User Logo */}
          {user ? (
            <span className="text-2xl flex items-center">
            <UserTooltip onClick={() => setIsLogout(true)} currentUser={user} />
              </span>
          ) : (
            <UserProfile className="navbar-icon text-4xl" onClick={() => handleLogin()} />
          )}
          <div className="lg:hidden">
            <MobMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
