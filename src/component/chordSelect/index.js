import React, {
	Component
} from 'react';
import './index.css';
import loading from './bars.svg';
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
class ChordSelect extends Component {
	constructor(props) {
		super(props);
		this.keyMap = ['1', '#1', 'b2', '2', '#2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', '#6', 'b7', '7'];
		this.state = {
			chordTone: ['1', '3', '5'],
			type: 3,
			keyBar1: 0,
			keyBar2: 38,
			keyBar3: 54,
			keyBar4: 0,
			keyBarShow1: false,
			keyBarShow2: false,
			keyBarShow3: false,
			keyBarShow4: false,
			loading: false
		}
        this.updateChord = this.updateChord.bind(this);
	}
	isArray(data) {
		return Object.prototype.toString.call(data) === '[object Array]';
	}
	isNumber(data) {
		return Object.prototype.toString.call(data) === '[object Number]';
	}
	isMobile() {
		return !!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
	}
	drawPianoMap() {
		return (
			<div className="key-map-box">
				{this.keyMap2.map((key, i)=>{
					if(!this.isArray(key)){
						return (
							<div className="white-key">
								<span className={"key-tone"+(i > 11 ? " octave":"")}>{key}</span>
								{this.isArray(this.keyMap2[i+1])?<div className="black-key"><span className="key-tone tone-add">{this.keyMap2[i+1][0]}</span><span className="key-tone tone-sub">{this.keyMap2[i+1][1]}</span></div>:null}
							</div>
						)
					}else{
						return null;
					}
				})}
			</div>
		)
	}
	touchMove(index, e) {
		let keyBarName = "keyBar" + (index + 1);
		let x = this.isNumber(e) ? e : e.touches[0].clientX;
		let dx = x - this.startX;
		let _state = {};
		let resultX = (this.keyBarX + dx) * 0.8;
		_state[keyBarName] = resultX < this.minLeft ? this.minLeft : (resultX > this.maxLeft ? this.maxLeft : resultX);
		let percent = (_state[keyBarName] - this.minLeft) / (this.maxLeft - this.minLeft + 0.01);
		let newKey = this.keyMap[Math.floor(percent * this.keyMap.length)];
		_state.chordTone = this.state.chordTone.concat();
		_state.chordTone[index] = newKey;
		this.setState(_state);

	}
	touchStart(index, e) {
		let keyBarName = "keyBar" + (index + 1);
		let _state = {};
		let clientX = this.isNumber(e) ? e : e.touches[0].clientX;
		_state["keyBarShow" + (index + 1)] = true;
		this.selectWidth = document.getElementById("key1").clientWidth;
		this.maxLeft = this.selectWidth * 0.9 - 20;
		this.minLeft = this.selectWidth * 0.1;
		this.startX = clientX;
		this.keyBarX = this.state[keyBarName];
		this.setState(_state);
	}
	updateChord(){
        this.props.selectFinish(this.state.chordTone);
	}
	touchEnd(index,value) {
		let _state = {

		};
		let oldChord=this.state.chordTone;
        oldChord[index]=value;
		let newChord=oldChord;
		_state.chordTone=newChord;
		_state["keyBarShow" + (index + 1)] = false;
		_state.loading = true;
		this.setState(_state);

		this.updateChord();
	}
    handleChange(event) {
		console.log(event)
        console.log(event.target.value)
		let inputName=event.target.name;
		let index = inputName.slice(inputName.length-1,inputName.length)
        this.touchEnd(parseInt(index),event.target.value);
	}
	createSelect() {
        const { classes } = this.props;
		return (

			<div className="key-select">
				{this.state.chordTone.map((key, i)=>{
					let flag = i+1;
					return (
                        <FormControl key={'thekey_'+i}>
							<div>

							</div>
                            <InputLabel htmlFor="age-helper">
								{ i===0 && '根音' }
                                { i===1 && '3度音' }
                                { i===2 && '5度音' }
                                { i===3 && '7度音' }
							</InputLabel>
                            <Select
                                value={this.state.chordTone[i]}
                                onChange={this.handleChange.bind(this)}
                                input={<Input name={'chordTone'+i} />}
                            >

								{this.keyMap.map((keyName,index)=>{
									return (
                                        <MenuItem key={'key'+index} value={keyName}>{keyName}</MenuItem>
										)
								})}
                            </Select>
                            <FormHelperText>选择和弦组成音</FormHelperText>
                        </FormControl>
					)
				})}
			</div>
		)
	}
	chordCountChange(count) {
		this.setState({
			chordTone: this.state.chordTone.slice(0, count),
			type: count
		});
		if (count === 4 && this.state.chordTone.length < 4) {
			this.setState({
				chordTone: this.state.chordTone.concat(['1']),
				keyBar4: 0
			});
		}
		this.forceUpdate(()=>{
			this.updateChord()
		})
	}
	hideLoading() {
		this.setState({
			loading: false
		});
	}
	render() {
        const { classes } = this.props;

        return (
			<div className="container-chordSelect">
				{this.createSelect()}
				<div className="chord-count">
					<div className={this.state.type === 3 ?"noselect active":"noselect"} onClick={this.chordCountChange.bind(this, 3)}>三音和弦</div>
					<div className={this.state.type === 4 ?"noselect active":"noselect"} onClick={this.chordCountChange.bind(this, 4)}>四音和弦</div>
				</div>
				{/*<div className={"loading-box"+(this.state.loading?" show":"")}><img src={loading} alt="" className="loading"/></div>*/}
			</div>
		);
	}
}

export default ChordSelect;