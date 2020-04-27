import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMacrosPecent } from '../utils';
import Pie from '../components/Pie';
import search from '../images/search.svg';
import toggler from '../images/toggler.svg';
import dragIcon from '../images/drag.svg';
import { useDrag } from 'react-dnd';
import ItemDroppable from './ItemDroppable';
import BlankSlate from '../components/BlankSlate';

const ItemDraggable = ({ macrosPercent, food }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: food.code },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <li className={isDragging ? 'diet-item dragging' : 'diet-item'}>
      <Pie p={macrosPercent.p} ch={macrosPercent.ch} f={macrosPercent.f} />
      <p className="diet-food-summary">{food.desc}</p>
      <img ref={drag} src={dragIcon} className="diet-food-summary-drag" />
    </li>
  )
}

const Builder = ({ meals, foods }) => {
  const codes = Object.values(foods).map(food => food.code);

  const [filter, setFilter] = React.useState('');
  const [collapsed, setCollapsed] = React.useState(false);
  const [filterMacros, setFilterMacros] = React.useState({ p: false, ch: false, f: false });

  const handleChangeCheckbox = (e) => {
    const macro = e.currentTarget.id;
    setFilterMacros({...filterMacros, [macro]: !filterMacros[macro]});
  }

  const renderFoods = () => {
    return Object.values(foods)
      .filter(food => !!food.macros)
      .filter(food => food.desc.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
      .filter(food => {
        const macrosPercent = getMacrosPecent(food.macros);
        return (!filterMacros.p && !filterMacros.ch && !filterMacros.f)
          || (
            (filterMacros.p ? macrosPercent.p > 0.3 : true)
            && (filterMacros.ch ? macrosPercent.ch > 0.3 : true)
            && (filterMacros.f ? macrosPercent.f > 0.3 : true)
          );
      })
      .map(food => {
        const macrosPercent = getMacrosPecent(food.macros);
        return <ItemDraggable macrosPercent={macrosPercent} food={food} />
      })
  }

  const renderMeals = () => {
    return Object.values(meals)
      .sort((a, b) => a.time - b.time)
      .map(meal =>
        codes.length && <ItemDroppable foodCodes={codes} meal={meal} />
      )
  }

  const renderBuilderClassName = () => {
    let className = 'builder';
    return className += collapsed ? ' collapsed' : ''
  }

  const renderFilterResult = () =>
    <>
      <div className="diet-titleSimple"><span className="highlight">{renderFoods().length}</span> foods after filtering</div>
      {!renderFoods().length && <BlankSlate />}
    </>

  return (
    <div className={renderBuilderClassName()}>
      <div className="builder-header">
        <h3 className="builder-header-title">Diet<p>Builder</p></h3>
        <div className="builder-header-filter">
          <div>
            <img src={search} className="builder-header-filter-icon" />
            <input
              className="builder-header-filter-input"
              name="search"
              type="text"
              value={filter}
              placeholder="Search food..."
              onChange={(e) => setFilter(e.currentTarget.value)}
            />
          </div>
          <div>
            <input checked={filterMacros.p} onChange={handleChangeCheckbox} className="builder-header-filter-checkbox" id="p" type="checkbox" />
            <label htmlFor="p" className="checkbox-p" />
            <input checked={filterMacros.ch} onChange={handleChangeCheckbox} className="builder-header-filter-checkbox" id="ch" type="checkbox" />
            <label htmlFor="ch" className="checkbox-ch" />
            <input checked={filterMacros.f} onChange={handleChangeCheckbox} className="builder-header-filter-checkbox" id="f" type="checkbox" />
            <label htmlFor="f" className="checkbox-f" />
          </div>
        </div>
      </div>
      <div className="builder-wrapper">
        <div className="builder-foods">
          {renderFilterResult()}
          <ul>{renderFoods()}</ul>
        </div>
        <div className="builder-diet">
          <div className="builder-diet-toggler">
            <img
              src={toggler}
              className="builder-diet-toggler-icon"
              onClick={() => setCollapsed(!collapsed)}
              />
          </div>
          <p className="builder-diet-summary">SUMMARY</p>
          <ul className="builder-diet-list">
            {renderMeals()}
          </ul>
        </div>
      </div>
    </div>
  );
}

Builder.propTypes = {
  foods: PropTypes.shape({
    any: PropTypes.shape({
      code: PropTypes.string,
      desc: PropTypes.string,
    })
  }),
};

Builder.defaultProps = {
  foods: {},
};

const mapStateToProps = state => ({
  foods: state.foods,
  meals: state.meals,
});

export default connect(mapStateToProps)(Builder);
export { Builder as PureComponent };
