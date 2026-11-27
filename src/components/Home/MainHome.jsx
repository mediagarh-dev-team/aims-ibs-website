'use client';
import React from 'react';
import HomeHero from './HomeHero';
import HomeStates from './HomeStates';
import HomePrograms from './HomePrograms';
import RankedSection from './RankedSection';
import GlobalCollaborations from './GlobalCollaborations';
import GlobalExposure from './GlobalExposure';
import Placements from './Placements';
import PlacedStudents from './PlacedStudents';
import WhyChoose from './WhyChoose';
import LifeAtIBS from './LifeAtIBS';
import SparkModel from './SparkModel';
import JoinCta from './JoinCta';

export default function MainHome({ data = null }) {
  return (
    <>
      <HomeHero cmsData={data?.hero ?? null} />
      <HomeStates cmsData={data?.stats?.length ? data.stats : null} />
      <HomePrograms cmsData={data?.programs ?? null} />
      <RankedSection cmsData={data?.ranked ?? null} />
      <GlobalCollaborations cmsData={data?.globalCollaborations ?? null} />
      <GlobalExposure cmsData={data?.globalExposure ?? null} />
      <Placements cmsData={data?.placements ?? null} />
      <PlacedStudents cmsData={data?.placedStudents ?? null} />
      <WhyChoose cmsData={data?.whyChoose ?? null} />
      <LifeAtIBS cmsData={data?.lifeAtIBS ?? null} />
      <SparkModel cmsData={data?.sparkModel ?? null} />
      <JoinCta cmsData={data?.joinCta ?? null} />
    </>
  );
}
