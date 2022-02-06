import PropTypes from "prop-types";
import styles from './styles/SelectorItem.module.css'

export default function SelectorItem(props) {


    return (
        <div className={styles.wrapper}>
            {props.data.blob ?
                <img src={props.data.blob} alt={props.data.name} className={styles.image}/>
            :
                <div className={styles.image} style={{backgroundColor: '#e0e0e0'}}/>
            }
            <label className={styles.label} title={props.data.name}>
                {props.data.name}
            </label>
        </div>
    )
}
SelectorItem.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        blob: PropTypes.string,
        creationDate: PropTypes.string
    })
}