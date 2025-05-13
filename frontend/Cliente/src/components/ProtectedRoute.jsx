import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, redirectTo = "/" }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    redirectTo: PropTypes.string,
};

export default ProtectedRoute;
