import styles from "../styles/Available.module.css";
import SetWorldRotation from "../nodes/transformation/SetWorldRotation";
import SetWorldTranslation from "../nodes/transformation/SetWorldTranslation";
import GetWorldTranslation from "../nodes/transformation/GetWorldTranslation";
import GetWorldRotation from "../nodes/transformation/GetWorldRotation";
import QuaternionToEuler from "../nodes/QuaternionToEuler";
import Add from "../nodes/operators/math/Add";
import Subtract from "../nodes/operators/math/Subtract";
import Multiply from "../nodes/operators/math/Multiply";
import Divide from "../nodes/operators/math/Divide";
import ToVector from "../nodes/operators/conversions/ToVector";
import FromVector from "../nodes/operators/conversions/FromVector";
import SetLocalRotation from "../nodes/transformation/SetLocalRotation";
import SetTransformationRelativeOrigin from "../nodes/transformation/SetTransformationRelativeOrigin";
import Print from "../nodes/Print";
import Xor from "../nodes/operators/boolean/Xor";
import Or from "../nodes/operators/boolean/Or";
import NotEqual from "../nodes/operators/boolean/NotEqual";
import Not from "../nodes/operators/boolean/Not";
import Nor from "../nodes/operators/boolean/Nor";
import Nand from "../nodes/operators/boolean/Nand";
import LessEqual from "../nodes/operators/boolean/LessEqual";
import Less from "../nodes/operators/boolean/Less";
import GreaterEqual from "../nodes/operators/boolean/GreaterEqual";
import Greater from "../nodes/operators/boolean/Greater";
import Equal from "../nodes/operators/boolean/Equal";
import And from "../nodes/operators/boolean/And";
import Branch from "../nodes/operators/boolean/Branch";


export const allNodes = [
    {
        label: <label className={styles.label}>Get world rotation</label>,
        dataTransfer: 'GetWorldRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GetWorldRotation()
    },
    {
        label: <label className={styles.label}>Get world translation</label>,
        dataTransfer: 'GetWorldTranslation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GetWorldTranslation()
    },
    {
        label: <label className={styles.label}>Set world rotation</label>,
        dataTransfer: 'SetWorldRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetWorldRotation()
    },
    {
        label: <label className={styles.label}>Set world translation</label>,
        dataTransfer: 'SetWorldTranslation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetWorldTranslation()
    },
    {
        label: <label className={styles.label}>Quaternion to Euler</label>,
        dataTransfer: 'QuaternionToEuler',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new QuaternionToEuler()
    },
    {
        label: <label className={styles.label}>Add</label>,
        dataTransfer: 'Add',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Add()
    }
    ,
    {
        label: <label className={styles.label}>Subtract</label>,
        dataTransfer: 'Subtract',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Subtract()
    },
    {
        label: <label className={styles.label}>Multiply</label>,
        dataTransfer: 'Multiply',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Multiply()
    },
    {
        label: <label className={styles.label}>Divide</label>,
        dataTransfer: 'Divide',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Divide()
    } ,


    {
        label: <label className={styles.label}>ToVector</label>,
        dataTransfer: 'ToVector',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new ToVector()
    },
    {
        label: <label className={styles.label}>FromVector</label>,
        dataTransfer: 'FromVector',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new FromVector()
    },
    {
        label: <label className={styles.label}>SetLocalRotation</label>,
        dataTransfer: 'SetLocalRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetLocalRotation()
    },
    {
        label: <label className={styles.label}>SetTransformationRelativeOrigin</label>,
        dataTransfer: 'SetTransformationRelativeOrigin',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetTransformationRelativeOrigin()
    },
    {
        label: <label className={styles.label}>Print</label>,
        dataTransfer: 'Print',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Print()
    },



    {
        label: <label className={styles.label}>Branch</label>,
        dataTransfer: 'Branch',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Branch()
    },
    {
        label: <label className={styles.label}>And</label>,
        dataTransfer: 'And',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new And()
    },
    {
        label: <label className={styles.label}>Equal</label>,
        dataTransfer: 'Equal',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Equal()
    },
    {
        label: <label className={styles.label}>Greater</label>,
        dataTransfer: 'Greater',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Greater()
    },
    {
        label: <label className={styles.label}>GreaterEqual</label>,
        dataTransfer: 'GreaterEqual',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GreaterEqual()
    },
    {
        label: <label className={styles.label}>Less</label>,
        dataTransfer: 'Less',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Less()
    },
    {
        label: <label className={styles.label}>LessEqual</label>,
        dataTransfer: 'LessEqual',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new LessEqual()
    },
    {
        label: <label className={styles.label}>Nand</label>,
        dataTransfer: 'Nand',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Nand()
    },
    {
        label: <label className={styles.label}>Nor</label>,
        dataTransfer: 'Nor',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Nor()
    },

    {
        label: <label className={styles.label}>Not</label>,
        dataTransfer: 'Not',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Not()
    },
    {
        label: <label className={styles.label}>NotEqual</label>,
        dataTransfer: 'NotEqual',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new NotEqual()
    },
    {
        label: <label className={styles.label}>Or</label>,
        dataTransfer: 'Or',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Or()
    },
    {
        label: <label className={styles.label}>Xor</label>,
        dataTransfer: 'Xor',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Xor()
    }
]