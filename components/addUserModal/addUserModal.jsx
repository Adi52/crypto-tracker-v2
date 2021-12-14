import React, { useEffect, useState } from "react";
import styles from "./addUserModal.style";
import scssStyles from "./addUserModal.module.scss";
import Modal from "react-modal";
import { TextField } from "@material-ui/core";
import "date-fns";
import CtaButton from "../buttons/ctaButton/ctaButton";
import "react-toastify/dist/ReactToastify.css";
import ReactCodeInput from "react-code-input";
import { auth } from "../../store/actions/login";
import axios from "axios";
import {API_ACCOUNTS, API_TRANSACTIONS} from "../../utils/constants/routers";
import {toast} from "react-toastify";

const AddUserModal = ({ isOpen, setIsOpen, fetchUsers }) => {
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setIsError(false);
    setName('');
    setPin('');
    setAvatarUrl('');
    fetchUsers();
    setIsOpen(false);
  }

  const postNewUser = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(API_ACCOUNTS, {
        name: name,
        picture: avatarUrl,
        pin: pin,
      })
      clearForm();
      setIsOpen(false);
      toast.success('🚀 Dodałeś nowego użytkownika!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.log(err, 'error in post new user')
      toast.error('😢 Wystąpił błąd przy dodawaniu nowego użytkownika, spróbuj ponownie!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setIsSubmitting(false);
  }

  const handleAddUser = async () => {
    if (!name || !pin || !avatarUrl) {
      setIsError(true);
    } else {
      setIsError(false);
      await postNewUser();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={() => setIsOpen(false)}
      style={styles}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <div className={scssStyles.inputsWrapper}>
        <p className={scssStyles.title}>DODAJ NOWEGO UŻYTKOWNIKA</p>
        {isError && (
          <p className={scssStyles.errorText}>Uzupełnij brakujące dane!</p>
        )}

        <div className={scssStyles.fullWidth}>
          <TextField
            value={name}
            onChange={(event) => setName(event.target.value)}
            id="filled-basic"
            label="Twój nick"
            type="text"
          />
        </div>
        <div className={scssStyles.fullWidth}>
          <TextField
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            id="filled-basic"
            label="Avatar (url)"
            type="text"
          />
        </div>
        <div className={scssStyles.pinWrapper}>
          <ReactCodeInput
            type="password"
            fields={4}
            value={pin}
            onChange={(value) => setPin(value)}
            pattern={"^[0-9]+$"}
          />
        </div>
        <CtaButton
          disabled={isSubmitting}
          onClick={handleAddUser}
          title={"Dodaj użytkownika"}
          style={{
            marginTop: 10,
          }}
        />
      </div>
    </Modal>
  );
};

export default AddUserModal;
