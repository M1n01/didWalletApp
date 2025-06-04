import "@ethersproject/shims";
import "@sinonjs/text-encoding";
import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

// import some data types:
import { IIdentifier } from "@veramo/core";
// Import the agent from our earlier setup
import { agent } from "./setup";

const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([]);

  // Add the new identifier to state
  const createIdentifier = async () => {
    const _id = await agent.didManagerCreate({
      provider: "did:peer",
      options: {
        num_algo: 2,
        service: {
          id: "1",
          type: "DIDCommMessaging",
          serviceEndpoint: "did:web:dev-didcomm-mediator.herokuapp.com",
          description: "for messaging",
        },
      },
    });
    setIdentifiers((s) => s.concat([_id]));
  };

  // Check for existing identifers on load and set them to state
  useEffect(() => {
    const getIdentifiers = async () => {
      const _ids = await agent.didManagerFind();
      setIdentifiers(_ids);

      // Inspect the id object in your debug tool
      console.log("_ids:", _ids);
    };

    getIdentifiers();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Identifiers</Text>
          <Button
            onPress={() => createIdentifier()}
            title={"Create Identifier"}
          />
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <View key={id.did}>
                  <Text>{id.did}</Text>
                </View>
              ))
            ) : (
              <Text>No identifiers created yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
