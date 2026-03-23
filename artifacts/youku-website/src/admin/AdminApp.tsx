import { Switch, Route } from "wouter";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import ContentManager from "./ContentManager";
import EpisodesManager from "./EpisodesManager";
import CarouselManager from "./CarouselManager";
import UsersManager from "./UsersManager";
import SubscriptionsManager from "./SubscriptionsManager";
import WalletManager from "./WalletManager";
import TransactionsManager from "./TransactionsManager";
import ActivitiesManager from "./ActivitiesManager";
import Settings from "./Settings";

export default function AdminApp() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={Dashboard} />
        <Route path="/admin/content" component={ContentManager} />
        <Route path="/admin/content/:id/episodes" component={EpisodesManager} />
        <Route path="/admin/carousel" component={CarouselManager} />
        <Route path="/admin/users" component={UsersManager} />
        <Route path="/admin/subscriptions" component={SubscriptionsManager} />
        <Route path="/admin/wallet" component={WalletManager} />
        <Route path="/admin/transactions" component={TransactionsManager} />
        <Route path="/admin/activities" component={ActivitiesManager} />
        <Route path="/admin/settings" component={Settings} />
      </Switch>
    </AdminLayout>
  );
}
