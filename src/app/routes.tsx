import { createBrowserRouter } from "react-router";
import { PropertyList } from "./screens/PropertyList";
import { Registration } from "./screens/Registration";
import { PropertyDetail } from "./screens/PropertyDetail";
import { Search } from "./screens/Search";
import { Favorites } from "./screens/Favorites";
import { Profile } from "./screens/Profile";
import { Login } from "./screens/Login";
import { Chat } from "./screens/Chat";
import { ChatDetail } from "./screens/ChatDetail";

export const router = createBrowserRouter([
  { path: "/", Component: PropertyList },
  { path: "/login", Component: Login },
  { path: "/registration", Component: Registration },
  { path: "/property/:id", Component: PropertyDetail },
  { path: "/search", Component: Search },
  { path: "/favorites", Component: Favorites },
  { path: "/profile", Component: Profile },
  { path: "/chat", Component: Chat },
  { path: "/chat/:propertyId", Component: ChatDetail },
]);
