import React, {
	Component
} from 'react';
import './App.css';
import ChordSelect from './component/chordSelect';
import ChordDraw from './component/chordDraw';
import { withStyles } from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});
class App extends Component {
	constructor(props) {
		super(props);
        this.chordDraw = React.createRef();
        this.chordSelect = React.createRef();
		this.state = {
            mainkey:'C'
		}
		this.mainKeys=['C','D','E','F','G','#G','A','B']
		this.baseTone={
			C:'3 6 2 5 7 3',
            D:'2 5 1 4 6 2',
            E:'1 4 b7 b3 5 1',
            F:'7 3 6 2 #4 7',
            G:'6 2 5 1 3 6',
            '#G':'#5 #1 #4 7 #2 #5',
            A:'5 1 4 b7 2 5',
            B:'4 d7 d3 d6 1 4',
		}
	}
	hideLoading() {
		// this.refs.chordSelect.hideLoading();
	}
    handleChange(event){
        this.setState({
            mainkey:event.target.value
		})
		this.forceUpdate(()=>{
            this.refs.chordSelect.updateChord();
		})
        // this.chordSelect.current.updateChord()
	}
	selectFinish(chordTone) {
		this.refs.chordDraw.draw(chordTone);
        // this.chordDraw.current.draw(chordTone);
	}
	render() {
        const { classes } = this.props;
		return (
			<div className="App">
				<div className="key-select-1">

					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="age-helper">Key</InputLabel>
						<Select
							value={this.state.mainkey}
							onChange={this.handleChange.bind(this)}
							input={<Input name="mainkey" />}
							>

							{this.mainKeys.map((keyName,index)=>{
								return (
									<MenuItem key={'key'+index} value={keyName}>{keyName}</MenuItem>
								)
							})}
						</Select>
						<FormHelperText>选择调式（{this.state.mainkey}大调） </FormHelperText>
                        <FormHelperText>吉他6弦 低音->高音（{this.baseTone[this.state.mainkey]}） </FormHelperText>

					</FormControl>
				</div>
				<ChordSelect ref="chordSelect" selectFinish={this.selectFinish.bind(this)}/>
				<ChordDraw ref="chordDraw" hideLoading={this.hideLoading.bind(this)} mainKey={this.state.mainkey} />
			</div>
		);
	}
}

export default withStyles(styles)(App);