import VueRouter from "vue-router";
import { AxiosInstance } from "axios";

interface IInitModule{
  router : VueRouter,
  parentRouter: string,
  common: {
    httpProxy: AxiosInstance,
    prcMap: any
  },
}

export default (params: IInitModule)=>{
  const { router, parentRouter, common: { httpProxy, prcMap } } = params;
  const routes = router.options.routes as any[];
  const target = routes.find(item=>item.name == parentRouter);
  target.children.push({
    path: "/home/DataSourceManagement",
    name: "DataSourceManagement",
    component: ()=>import("./view/a.vue")
  });

  target.children.push({
    path: "/home/CollectorManagement",
    name: "CollectorManagement",
    component: () => import("./view/b.vue")
  });
};
