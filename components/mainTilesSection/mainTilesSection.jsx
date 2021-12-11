import React from 'react';
import styles from './mainTilesSection.module.scss';
import MainTile from "../mainTile/mainTile";

const MainTilesSection = ({howMuchInvested, portfolioPrice, allProfit, isLoading}) => {

  return <section className={styles.container}>
    <MainTile title={'Zainwestowałeś'} value={howMuchInvested} suffix={'$'} isLoading={isLoading} />
    <MainTile title={'Wartość razem'} value={portfolioPrice} suffix={'$'} isLoading={isLoading} />
    <MainTile title={'Zysk'} value={allProfit} suffix={'$'} isLoading={isLoading} colorProfit />
  </section>
}

export default MainTilesSection;
