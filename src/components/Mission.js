import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import styles from "./Mission.module.css";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
const GET_MISSION = gql`
  query ($id: ID!) {
    launch(id: $id) {
      launch_success
      launch_year
      launch_site {
        site_name
        site_name_long
      }
      links {
        flickr_images
      }
      mission_name
      rocket {
        rocket {
          name
          id
        }
      }
      details
    }
  }
`;
const GET_DETAIL = gql`
  query ($id: ID!) {
    launch(id: $id) {
      details
    }
  }
`;
function Mission() {
  const [showDetail, setShowDetail] = useState(false);

  const { missionId } = useParams();
  // console.log(missionId);
  const [backImg, setBackImg] = useState({});
  const { data, loading } = useQuery(GET_MISSION, {
    variables: {
      id: missionId,
    },
    onCompleted: (data) => {
      console.log(data.launch.links.flickr_images);
      setBackImg({
        imgs: data.launch.links.flickr_images,
        len: data.launch.links.flickr_images.length,
        curr: data.launch.links.flickr_images[0],
        currIndex: 0,
      });
    },
  });
  useEffect(() => {
    let interval;
    if (data) {
      interval = setInterval(() => {
        // console.log(backImg);
        setBackImg((prev) => {
          console.log(prev);
          return {
            ...prev,
            curr: data.launch.links.flickr_images[
              (prev.currIndex + 1) % prev.len
            ],
            currIndex: (prev.currIndex + 1) % prev.len,
          };
        });
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [data]);
  const [getDetail, { data: detailData, loading: detailLoading }] =
    useLazyQuery(GET_DETAIL, {
      variables: { id: missionId },
    });
  if (loading) {
    return <h2 className={styles.center}>Loading...</h2>;
  }
  const status = data && data.launch.launch_success;

  //!-------------------------------------
  const btnHandler = () => {
    getDetail();
    setShowDetail(true);
  };
  const lessHandler = () => {
    setShowDetail(false);
  };
  //!-------------------------------------

  return (
    <div className={styles.mission}>
      {createPortal(
        <AnimatePresence>
          <div className={styles.backdrop}>
            <motion.img
              initial={{ opacity: 0 }}
              animate={
                backImg && {
                  opacity: 1,
                  transition: {
                    duration: 2,
                  },
                }
              }
              src={backImg.curr}
              alt="images"
            />
          </div>
        </AnimatePresence>,
        document.getElementById("overlay")
      )}
      <span className={styles.missionDetail}>Mission Detail</span>
      <div className={styles.padding}>
        <section className={styles.missionName}>
          {data.launch.mission_name}
        </section>
        <section className={styles.info}>
          <div>launch year: {data.launch.launch_year}</div>

          <div className={styles.status}>
            status:{" "}
            <span className={status ? styles.success : styles.failed}>
              {status ? "launch successful" : "launch failed"}
            </span>
          </div>
        </section>
        <div className={styles.location}>
          location: {data.launch.launch_site.site_name_long}
        </div>
        <div className={styles.rocket}>
          Rocket:{" "}
          <Link
            className={styles.rocketLink}
            to={`/rocket/${data.launch.rocket.rocket.id}`}
          >
            <span>{data.launch.rocket.rocket.name}</span>
          </Link>
        </div>

        {!showDetail && (
          <button onClick={btnHandler} className={styles.btn}>
            show more
          </button>
        )}
        {detailData && !detailLoading && showDetail && (
          <>
            <p>{detailData.launch.details}</p>
            <button className={styles.btn} onClick={lessHandler}>
              show less
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export default Mission;
