import React, { Component } from 'react'
import { Icon } from 'native-base'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import { Octicons } from '@expo/vector-icons'
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
    this.groupedByMonth = {}
  }

  componentDidMount () {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists entries (id integer primary key not null, date text, entry text);'
      )
    })
    this.sortEntries()
  }
  componentWillReceiveProps (props) {
    this.sortEntries(props)
  }
  sortEntries (props = this.props) {
    this.groupedByMonth = {}
    props.entries.sort((a, b) => b.date - a.date).map(this.groupByDate)
    this.setState({ sortedDates: this.groupedByMonth })
  }
  createEntry = () => {
    this.props.navigation.navigate('Prompt', {})
  }
  groupByDate = (value, index, array) => {
    let date = moment(parseInt(value.date))
    let month = date.format('MMMM YYYY')
    let day = date.format('dddd, MMMM D')
    this.groupedByMonth[month] = this.groupedByMonth[month] || []
    this.groupedByMonth[month][day] = this.groupedByMonth[month][day] || []
    this.groupedByMonth[month][day].push(value)
  }
  handleTextChange = (value) => {
    this.setState({ text: value })
  }
  editEntry = (value) => {
    this.props.navigation.navigate('Prompt', {entry: value})
  }
  styles = StyleSheet.create({
    bodyText: {
      color: '#F5F3BB',
      fontSize: 18,
      textAlign: 'center'
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 22,
      textAlign: 'center',
      fontFamily: 'quicksand',
      color: '#F5F3BB',
      marginBottom: 3
    },
    monthHeader: {
      textShadowColor: '#211412',
      marginBottom: 7,
      textShadowOffset: { width: 2, height: 2 },
      fontSize: 30,
      color: 'orange',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    monthGroup: {
      marginBottom: 20
    },
    innerView: {
      alignSelf: 'flex-start',
      paddingTop: 10,
      paddingHorizontal: 10,
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
    },
  })
  render () {
    let { sortedDates } = this.state
    let entryCards = Object.keys(sortedDates).length > 0
      ? Object.keys(sortedDates).map((month, index) => {
        const childCards = Object.keys(sortedDates[month]).map((day, idx) => {
          let finalEntries = sortedDates[month][day].map((value, i) => {
            return (
              <TouchableOpacity key={i} style={this.styles.card} onPress={()=>this.editEntry(value)}>
                <View>
                  <Text style={[this.styles.bodyText]}>{value.entry}</Text>
                </View>
              </TouchableOpacity>
            )
          })
          return (
            <View key={idx}>
              <Text style={this.styles.headerText}>{day}</Text>
              {finalEntries}
            </View>
          )
        })
        return (
          <View style={this.styles.monthGroup} key={index}>
            <Text style={this.styles.monthHeader}>{month}</Text>
            {childCards}
          </View>
        )

      })
      : (
        <Text style={this.styles.bodyText}>Once you have a journal entry, it will appear here</Text>
      )
    return (
      <Background>
        <ScrollView
          style={this.styles.scroll}
          contentContainerStyle={this.styles.innerView}
        >
          <View>
            {entryCards}
          </View>
        </ScrollView>
        <TouchableOpacity onPress={this.createEntry} style={this.styles.editButton}>
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