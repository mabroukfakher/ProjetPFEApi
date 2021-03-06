import security from "../lib/security";
import RolesService from "../services/role/role";

class RolesRoute {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {

    this.router.get(
      "/v1/roles",
      security.checkUserScope.bind(this, security.scope.CHEF),
      this.getRoles.bind(this)
    );
  }

  async getRoles(req, res, next) {
    try {
      const data = await RolesService.getRoles();
      return res.send(data);
    } catch (err) {
      return next(err);
    }
  }

}

export default RolesRoute;
