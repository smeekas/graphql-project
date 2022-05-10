import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import styles from "./Rocket.module.css";
const GET_ROCKET = gql`
  query ($id: ID!) {
    rocket(id: $id) {
      description
      cost_per_launch
      boosters
      diameter {
        meters
      }
      height {
        meters
      }
      mass {
        kg
      }
      name
      first_flight
      success_rate_pct
    }
  }
`;
function Rocket({ id }) {
  const { rocketId } = useParams();
  const { data, loading, error } = useQuery(GET_ROCKET, {
    variables: {
      id: rocketId,
    },
  });
  if (loading) {
    return <h2 className={styles.center}>Loading...</h2>;
  }

  return (
    <div className={styles.rocket}>
      <span className={styles.rocketDetail}>Rocket Detail</span>
      <div className={styles.padding}>
        <section className={styles.rocketName}>{data.rocket.name}</section>
        <div className={styles.info}>
          <div>Height: {data.rocket.height.meters} meters</div>
          <div>Diameter: {data.rocket.diameter.meters} meters</div>
          <div>Mass: {data.rocket.mass.kg} kg</div>
        </div>
        <div className={styles.moreInfo}>
          <section>success rate: {data.rocket.success_rate_pct}%</section>
          <section>cost per launch: {data.rocket.cost_per_launch} USD</section>
          <section>Boosters: {data.rocket.boosters}</section>
          <section>First Flight: {data.rocket.first_flight}</section>
        </div>
        <p>{data.rocket.description}</p>
      </div>
    </div>
  );
}

export default Rocket;
