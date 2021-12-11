import React, {useState} from "react";
import styles from "./profileLoginTile.module.scss";
import avatarPlaceholder from "../../utils/constants/avatarPlaceholder";
import * as PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/login";

const ProfileLoginTile = ({ userInfo }) => {
  const { name, picture } = userInfo;
  const [avatar, setAvatar] = useState(picture);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(login(userInfo));
    router.push("login");
  };

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      <img
        src={avatar ? avatar : avatarPlaceholder}
        onError={() => setAvatar('')}
      />
      <p>{name}</p>
    </div>
  );
};

export default ProfileLoginTile;
