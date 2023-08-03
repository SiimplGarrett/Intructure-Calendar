import React from "react"
import moment from 'moment'
import {AccessibleContent, Calendar, IconArrowOpenStartSolid, IconArrowOpenEndSolid, IconButton, Select, Checkbox} from "@instructure/ui"


class Example extends React.Component {
  state = {
    todayDate: moment(),
    renderedDate: moment(),
    firstDate: [null, null],
    showOptions: false,
    HighlightId: "allowAll",
    SelectedId: "allowAll",
    inputText: "Allow selecting of all dates",
    maxDays:false
  }
  

  generateMonth = () => {
    const date = parseDate(this.state.renderedDate)
      .startOf('month')
      .startOf('week')

    return Array.apply(null, Array(Calendar.DAY_COUNT)).map(() => {
      const currentDate = date.clone()
      date.add(1, 'days')
      return currentDate
    })
  }

  renderWeekdayLabels = () => {
    const date = parseDate(this.state.renderedDate).startOf('week')

    return Array.apply(null, Array(7)).map(() => {
      const currentDate = date.clone()
      date.add(1, 'day')

      return (
        <AccessibleContent alt={currentDate.format('dddd')}>
          {currentDate.format('dd')}
        </AccessibleContent>
      )
    })
  }

  handleRenderNextMonth = (event) => {
    this.modifyRenderedMonth(1)
  }

  handleRenderPrevMonth = (event) => {
    this.modifyRenderedMonth(-1)
  }

  modifyRenderedMonth = (step) => {
    this.setState(({ renderedDate }) => {
      const date = parseDate(renderedDate)
      date.add(step, 'month')
      return { renderedDate: date.toISOString() }
      
    })
  }
  
  handleDayClicked = (event,date) => {
    this.selectDayClicked(date)
  }

  selectDayClicked = (datePicked) => {
    const dates = this.state.firstDate
    var selectable = this.state.SelectedId
    var now = moment()
    var picked = moment(datePicked.date)
    var addSelection = true
    switch (selectable) {
      case "allowAll":
        addSelection = true
        break;
      case "allowPrevious":
        addSelection = picked.isSameOrBefore(now,"day")
        break;
      case "allowFuture":
        addSelection = picked.isSameOrAfter(now,"day")
        break;
    
      default:
        addSelection = true
        break;
    }
    var fromStart = dates[0] == null || (dates[0] && Math.abs(dates[0].diff(picked,'day')) <= 20)
    var fromEnd = dates[1] == null || (dates[1] && Math.abs(dates[1].diff(picked,'day')) <= 20)
    var under20 = !this.state.maxDays || (this.state.maxDays && fromStart && fromEnd)
      console.log(under20)
    if (addSelection && under20){
    this.setState(() => {
      const date = parseDate(datePicked.date)
      if (!dates[0]){
        if (dates[1] && !date.isBefore(dates[1], 'day')){
          return { firstDate: [null, dates[1]] }
        }
        else{
          console.log(dates)
          return { firstDate: [date, dates[1]] }
        }
      }
      else if (!dates[1] && date.isAfter(dates[0], 'day')){
        return { firstDate: [dates[0], date] }
      }
      else if(date.isSame(dates[0], 'day')){
        return { firstDate: [null, dates[1]] }
      }
      else if(date.isSame(dates[1], 'day')){
        return { firstDate: [dates[0], null] }
      }
      else if(date.isBefore(dates[1], 'day')){
        return { firstDate: [date, dates[1]] }
      }
      else if(date.isAfter(dates[0], 'day')){
        return { firstDate: [dates[0], date] }
      }
    })
  }
  }

/* start select helper functions */
  handleShowOptions = () => {
    this.setState({
      showOptions: true
    })
  }

  handleHideOptions = () => {
    this.setState({
      showOptions: false
    })
  }

  handleHighlightOption = (id) => {
    this.setState({
      HighlightId: id
    })
  }

  getOptionById (queryId) {
    return this.props.options.find(({ id }) => id === queryId)
  }

  handleSelectOption = (event, { id }) => {
    const option = this.getOptionById(id).label
    this.setState({
      showOptions: false,
      inputText: option,
      SelectedId: id
    })
    this.unsetDates()
  }

  unsetDates = () => {
    this.setState((firstDate)=>{
      return {firstDate: [null, null]}
    })
  }

  limitDays = () => {
    this.setState(({maxDays})=>{
      return {maxDays:!maxDays}
    })
    this.unsetDates()
  }
/* end select helper functions */

  renderDay (date) {
    const {
      renderedDate,
      todayDate,
      firstDate
    } = this.state

    return (
      <Calendar.Day
        key={date.toISOString()}
        date={date.toISOString()}
        isOutsideMonth={!date.isSame(renderedDate, 'month')}
        isToday={date.isSame(todayDate, 'day')}
        isSelected={date.isBetween(firstDate[0], firstDate[1], 'day', "[]") || date.isSame(firstDate[0], 'day') || date.isSame(firstDate[1], 'day')}
        label={`${date.format('D')} ${date.format('MMMM')} ${date.format('YYYY')}`}
        onClick={this.handleDayClicked}
      >
        {date.format('D')}
      </Calendar.Day>
    )
  }

  render () {
    const{
        showOptions,
        HighlightId,
        SelectedId,
        inputText,
        maxDays
      } = this.state
    const date = parseDate(this.state.renderedDate)

    const buttonProps = (type = 'prev') => ({
      size: 'small',
      withBackground: false,
      withBorder: false,
      renderIcon: type === 'prev'
        ? <IconArrowOpenStartSolid color="primary" />
        : <IconArrowOpenEndSolid color="primary" />,
      screenReaderLabel: type === 'prev' ? 'Previous month' : 'Next month'
    })

    return (
      <div class="container">
      <Checkbox 
        label={"Limit days selected to 20"} 
        value="large" 
        variant="toggle"
        checked={maxDays}
        onChange={this.limitDays}
        themeOverride={{
          color: 'licorice',
          // checkedBackground: 'white',
          labelColor: 'white',
          checkedLabelColor: 'white'
        }}
      />
      <Select
          inputValue={inputText}
          isShowingOptions={showOptions}
          onBlur={this.handleBlur}
          onRequestShowOptions={this.handleShowOptions}
          onRequestHideOptions={this.handleHideOptions}
          onRequestHighlightOption={this.handleHighlightOption}
          onRequestSelectOption={this.handleSelectOption}
        >
          {this.props.options.map((option) => {
            return (
              <Select.Option
                id={option.id}
                key={option.id}
                isHighlighted={option.id === HighlightId}
                isSelected={option.id === SelectedId}
              >
                { option.label }
              </Select.Option>
          )
          })} 
        </Select>
      <Calendar
        renderPrevMonthButton={<IconButton {...buttonProps('prev')} />}
        renderNextMonthButton={<IconButton {...buttonProps('next')} />}
        renderNavigationLabel={
          <span>
            <div>{date.format('MMMM')}</div>
            <div>{date.format('YYYY')}</div>
          </span>
        }
        renderWeekdayLabels={this.renderWeekdayLabels()}
        onRequestRenderNextMonth={this.handleRenderNextMonth}
        onRequestRenderPrevMonth={this.handleRenderPrevMonth}
      >
        {this.generateMonth().map(date => this.renderDay(date))}
      </Calendar>
      </div>
    )
  }
}

const parseDate = (dateStr) => {
  return moment(dateStr, [moment.ISO_8601])
}
export default Example;
// render(<Example />)