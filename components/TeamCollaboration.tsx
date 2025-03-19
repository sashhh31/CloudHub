
import React from 'react';
import FeatureSection from './shared/FeatureSection';

const TeamCollaboration = () => {
  return (
    <FeatureSection
      title="identify strengths and areas for improvement."
      description="Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that was previously slowing us down. It's also one of the only channels where."
      bgColor="bg-white"
      reversed={true}
      imageComponent={
        <div className="rounded-xl overflow-hidden bg-white p-4 shadow-lg">
          <img
            src="/lovable-uploads/f6ce9e45-2314-4a1f-9a25-e81270ba2570.png"
            alt="Team Collaboration"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      }
    />
  );
};

export default TeamCollaboration;
