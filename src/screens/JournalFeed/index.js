import React, { Component } from 'react'
import {Icon} from 'native-base'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import {Octicons} from '@expo/vector-icons'
import StatusBumper from '../../components/StatusBumper'
import moment from 'moment'
import { db } from '../../../App'
import { connect, dispatch } from 'react-redux'
import { setJournalEntries } from '../../redux/actions/journal-actions'
import { Background } from '../../components/Background'

class JournalFeed extends Component {

  constructor (props) {
    super(props)
    this.state = {
      entries: [],
      text: '',
      sortedDates: {},
    }
    groupedByMonth = {}
  }

  componentDidMount () {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists entries (id integer primary key not null, date text, entry text);'
      )
      tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {

        //this.props.setEntries(_array)
      })
    })
    this.sortEntries()
  }
  componentWillReceiveProps (props) {
    this.sortEntries()
  }
  sortEntries () {
    this.groupedByMonth = {}
    this.props.entries.sort((a, b) => b.date - a.date).map(this.groupByMonth)
    this.setState({ sortedDates: this.groupedByMonth })
  }
  createEntry = () => {
    this.props.navigation.navigate('Prompt')
  }
  groupByMonth = (value, index, array) => {
    d = moment(parseInt(value.date))
    d = d.format('MMMM YYYY')
    this.groupedByMonth[d] = this.groupedByMonth[d] || []
    this.groupedByMonth[d].push(value)
  }
  handleTextChange = (value) => {
    this.setState({ text: value })
  }
  styles = StyleSheet.create({
    bodyText: {
      color: '#F5F3BB',
      fontSize: 18,
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 25,
      fontFamily: 'quicksand',
      color: '#F5F3BB',
    },
    innerView: {
      paddingHorizontal: 15,
    },
    card: {
      marginBottom: 20
    },
    editButton: {
      backgroundColor: 'orange',
      position: 'absolute',
      bottom: 15,
      right: 15,
      height: 70,
      width: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5
    },
    editIcon: {
      color: 'white',
      fontSize: 30,
    }
  })
  render () {
    let { sortedDates } = this.state
    let entryCards = sortedDates ? Object.keys(sortedDates).map((value, index) => {
      return sortedDates[value].map((value, index) => {
        return (
          <View key={index} style={this.styles.card}>
            <View >
              <Text style={this.styles.headerText}>{moment(parseInt(value.date)).format('dddd, MMMM D, YYYY')}</Text>
            </View>
            <View>
              <Text style={this.styles.bodyText}>{value.entry}</Text>
            </View>
          </View>
        )
      })
    }) : null
    return (
      <Background>
        <ScrollView
          contentContainerStyle={this.styles.innerView}
        >
          <View>
            <TouchableOpacity onPress={this.createEntry}><Text>CreateEntry</Text></TouchableOpacity>
            {entryCards}
          </View>
        </ScrollView>
        <TouchableOpacity style={this.styles.editButton}>
          <Octicons name='pencil' style={this.styles.editIcon} />
        </TouchableOpacity>
      </Background>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    entries: state.Journals.entries
  }
}
mapDispatchToProps = (dispatch) => ({
  setEntries: (entries) => dispatch(setJournalEntries(entries))
})
export default connect(mapStateToProps, mapDispatchToProps)(JournalFeed)