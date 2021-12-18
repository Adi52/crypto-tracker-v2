import React, { useEffect, useState } from "react";
import styles from "./addTransactionModal.style";
import scssStyles from "./addTransactionModal.module.scss";
import Modal from "react-modal";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles, TextField } from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { COINS_LIST_ROUTE } from "../../utils/constants/routers";
import CtaButton from "../buttons/ctaButton/ctaButton";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
  },
}));

const filterOptions = createFilterOptions({
  limit: 100,
});

const parseToNumber = (text) => {
  const formattedText = text.replace(",", ".");
  return parseFloat(formattedText);
};

const AddTransactionModal = ({ isOpen, setIsOpen, handleRefresh }) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchasedCrypto, setPurchasedCrypto] = useState("");
  const [purchasedPrice, setPurchasedPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasedDate, setPurchasedDate] = useState(new Date());
  const [isError, setIsError] = useState(false);

  const [cryptoList, setCryptoList] = useState([]);
  const handleDateChange = (date) => {
    setPurchasedDate(date);
  };

  const getCryptoList = async () => {
    const response = await fetch(COINS_LIST_ROUTE);
    const resJson = await response.json();
    setCryptoList(resJson);
  };

  const clearForm = () => {
    setPurchasedCrypto("");
    setPurchasedPrice("");
    setQuantity("");
    setPurchasedDate(new Date());
    setIsError(false);
  };

  const postNewTransaction = async () => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/transaction/add", {
        purchasedCryptoId: purchasedCrypto.id,
        purchasedCryptoSymbol: purchasedCrypto.symbol,
        purchasedPrice: parseToNumber(purchasedPrice),
        quantity: parseToNumber(quantity),
        purchasedDate,
      });
      clearForm();
      setIsOpen(false);
      toast.success("🚀 Dodałeś transakcję!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.log(err, "error in post new transatcion");
      toast.error(
        "😢 Wystąpił błąd przy dodawaniu transakcji, spróbuj ponownie!",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
    setIsSubmitting(false);
    handleRefresh();
  };

  const handleAddTransaction = () => {
    if (!purchasedPrice || !purchasedCrypto || !quantity || !purchasedDate) {
      setIsError(true);
    } else {
      setIsError(false);
      postNewTransaction();
    }
  };

  useEffect(() => {
    getCryptoList();
  }, []);

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
        <p className={scssStyles.title}>DODAJ NOWĄ TRANSAKCJĘ</p>
        {isError && (
          <p className={scssStyles.errorText}>Uzupełnij brakujące dane!</p>
        )}
        <div className={scssStyles.fullWidth}>
          <Autocomplete
            classes={classes}
            style={{ width: "100%" }}
            // value={purchasedCrypto}
            onChange={(_, newValue) => setPurchasedCrypto(newValue)}
            options={cryptoList}
            filterOptions={filterOptions}
            getOptionLabel={(option) =>
              `${option.symbol.toUpperCase()} - ${option.name}`.substr(0, 45)
            }
            id="clear-on-escape"
            clearOnEscape
            renderInput={(params) => (
              <TextField {...params} label="Jaka krypto" margin="normal" />
            )}
          />
        </div>
        <div className={scssStyles.row}>
          <div className={scssStyles.inputWrapper}>
            <TextField
              value={purchasedPrice}
              onChange={(event) => setPurchasedPrice(event.target.value)}
              id="filled-basic"
              label="Cena w momencie kupna"
              type="number"
              inputProps={{
                style: {
                  color: "white",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </div>
          <div className={scssStyles.inputWrapper}>
            <TextField
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              id="filled-basic"
              label="Ile kupiłeś"
              type="number"
              inputProps={{
                style: {
                  color: "white",
                },
              }}
            />
          </div>
        </div>
        <div className={scssStyles.fullWidth}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              style={{ width: "100%" }}
              margin="normal"
              id="date-picker-dialog"
              label="Kiedy"
              format="MM/dd/yyyy"
              value={purchasedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              inputProps={{
                style: {
                  color: "white",
                },
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <CtaButton
          disabled={isSubmitting}
          onClick={handleAddTransaction}
          title={"Dodaj transakcję"}
          style={{
            marginTop: 10,
          }}
        />
      </div>
    </Modal>
  );
};

export default AddTransactionModal;
