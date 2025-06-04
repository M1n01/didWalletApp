import "@ethersproject/shims";
import "@sinonjs/text-encoding";
import "cross-fetch/polyfill";
import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

// import some data types:
import { DIDResolutionResult, IIdentifier } from "@veramo/core";
// Import the agent from our earlier setup
import { agent } from "./setup";

const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([]);
  const [resolutionResult, setResolutionResult] = useState<
    DIDResolutionResult | undefined
  >();

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

  const resolveDID = async (did: string) => {
    const result = await agent.resolveDid({ didUrl: did });
    console.log(JSON.stringify(result, null, 2));
    setResolutionResult(result);
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
                <Button
                  key={id.did}
                  onPress={() => resolveDID(id.did)}
                  title={id.did}
                />
              ))
            ) : (
              <Text>No identifiers created yet</Text>
            )}
          </View>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Resolved DID document
          </Text>
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {resolutionResult ? (
              <Text>
                {JSON.stringify(resolutionResult.didDocument, null, 2)}
              </Text>
            ) : (
              <Text>tap on a DID to resolve it</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
